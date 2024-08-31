import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const page = sqliteTable('Page', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    url: text('url').unique().notNull(),
    title: text('title'),

  }
);

export const pageRelations = relations(page, ({ many }) => ({
  saves: many(pageSaves),
}));

export const pageSaves = sqliteTable('PageSaves', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  savedAt: integer('savedAt', { 'mode': 'timestamp'}).notNull().default(sql`(unixepoch())`),
  saveType: text('saveType'),
  pageId: integer('pageId').references(() => page.id, { onUpdate: 'cascade', onDelete: 'restrict'}),
})

export const pageSavesRelations = relations(pageSaves, ({ one }) => ({
  page: one(page, {
    fields: [pageSaves.pageId],
    references: [page.id],
  }),
}));

export const pageHighlights = sqliteTable('PageHighlights', {
  id: integer('id').primaryKey({ autoIncrement: true}),
  savedAt: integer('savedAt', { 'mode': 'timestamp'}).notNull().default(sql`(unixepoch())`),
  highlight: text('highlight').notNull(),
  highlightText: text('highlightText'),
  pageId: integer('pageId').references(() => page.id, { onUpdate: 'cascade', onDelete: 'restrict'}),
})

