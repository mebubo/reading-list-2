// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type RequestData = {
  url: string,
  title: string | undefined,
  saveType: string,
}

type ResponseData = {
  message: string,
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    res.status(200).json({ message: 'ok' })
    return
  }

  const pageData = bodyToRequestData(req.body)
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

  res.status(200).json({ message: 'hello' })
}

function bodyToRequestData(body: any): RequestData {
  return {
    url: body.url,
    title: body.title,
    saveType: body.saveType,
  }
}