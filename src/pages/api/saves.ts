import type { NextApiRequest, NextApiResponse } from 'next'

import { z } from 'zod'

const RequestData = z.object({
  url: z.string(),
  title: z.string().optional(),
  saveType: z.enum(["manual", "visit"]),
})

type RequestData = z.infer<typeof RequestData>

type ResponseData = {
  message: string,
  details?: any
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  if (req.method === 'OPTIONS') {
    res.status(200).json({ message: 'ok' })
    return
  }

  if (req.method === 'GET') {
    const url = req.query.url
    // return an error if url is undefined or is an array
    if (url === undefined || Array.isArray(url)) {
      res.status(400).json({ message: `Invalid request parameters`, details: `url is undefined or is an array` })
      return
    }
    const page = await prisma.page.findUnique({
      where: { url },
      include: { saves: true }
    })
    const savesCount = page?.saves.length || 0
    res.status(200).json({ message: "ok", details: { savesCount } })
    return
  }

  const data = bodyToRequestData(req.body)
  if (!data.success) {
    res.status(400).json({ message: `Invalid request parameters`, details: data.error.flatten() })
    return
  }

  const pageData = data.data

  console.log(pageData)

  const page = await prisma.page.upsert({
    where: {
      url: pageData.url
    },
    update: {},
    create: {
      url: pageData.url,
      title: pageData.title,
    }
  })

  await prisma.pageSaves.create({
    data: {
      saveType: pageData.saveType,
      pageId: page.id
    }
  })

  res.status(200).json({ message: "saved" })

}

function bodyToRequestData(body: any): z.SafeParseReturnType<RequestData, RequestData> {
  const result = RequestData.safeParse(body)
  return result
}