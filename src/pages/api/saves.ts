import type { NextApiRequest, NextApiResponse } from 'next'

import { z } from 'zod'

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../../../db/schema';
import { eq } from 'drizzle-orm';

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

const client = createClient({ url: process.env.DATABASE_URL || 'sqlite://prisma/dev.db' });
const db = drizzle(client, { schema });

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
    if (url === undefined || Array.isArray(url)) {
      res.status(400).json({ message: `Invalid request parameters`, details: `url is undefined or is an array` })
      return
    }
    const page = await db.query.page.findFirst({
      where: eq(schema.page.url, url),
      with: { saves: true }
    })
    const savesCount = page?.saves.length || 0
    res.status(200).json({ message: "ok", details: { savesCount } })
    return
  }

  if (req.method === 'POST') {

    const data = bodyToRequestData(req.body)
    if (!data.success) {
      res.status(400).json({ message: `Invalid request parameters`, details: data.error.flatten() })
      return
    }

    const pageData = data.data

    console.log(pageData)

    await db
      .insert(schema.page)
      .values({
        url: pageData.url,
        title: pageData.title,
      })
      .onConflictDoNothing()

    const page = await db.select().from(schema.page).where(eq(schema.page.url, pageData.url))
    console.log("==============================", page)

    await db.insert(schema.pageSaves).values({
      saveType: pageData.saveType,
      pageId: page[0].id
    })

    res.status(200).json({ message: "saved" })
  }

}

function bodyToRequestData(body: any): z.SafeParseReturnType<RequestData, RequestData> {
  const result = RequestData.safeParse(body)
  return result
}