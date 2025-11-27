#!/usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const ask = (question) => new Promise((resolve) => rl.question(question, resolve))

async function main() {
  console.log('\n--- Add New App to Code63Labs ---\n')

  const title = await ask('App name: ')
  const slug = (await ask(`Slug (${title.toLowerCase().replace(/\s+/g, '-')}): `)) || title.toLowerCase().replace(/\s+/g, '-')
  const icon = await ask('Emoji icon: ')
  const color = await ask('Color (e.g. #FF5722): ')
  const embedUrl = await ask('App URL: ')
  const category = await ask('Category (utility/productivity/fun/finance/health): ')

  console.log('\nStatus options: idea, building, testing, mvp, shipped')
  const status = await ask('Status (shipped): ') || 'shipped'

  const today = new Date().toISOString().split('T')[0]

  const newApp = {
    slug,
    title,
    icon,
    color,
    embedUrl,
    category: category || undefined,
    createdAt: today,
    status,
  }

  // Read current apps.ts
  const appsPath = path.join(process.cwd(), 'src', 'config', 'apps.ts')
  let content = fs.readFileSync(appsPath, 'utf-8')

  // Find the apps array and add the new app
  const appEntry = `  {
    slug: '${newApp.slug}',
    title: '${newApp.title}',
    icon: '${newApp.icon}',
    color: '${newApp.color}',
    embedUrl: '${newApp.embedUrl}',${newApp.category ? `\n    category: '${newApp.category}',` : ''}
    createdAt: '${newApp.createdAt}',
    status: '${newApp.status}',
  },`

  // Insert before the closing bracket of the apps array
  content = content.replace(
    /^(export const apps: App\[\] = \[[\s\S]*?)(\n\])/m,
    `$1\n${appEntry}$2`
  )

  fs.writeFileSync(appsPath, content)

  console.log(`\n Added ${title}!`)
  console.log(`\nRun 'git add . && git commit -m "Add ${title}" && git push' to deploy.\n`)

  rl.close()
}

main().catch(console.error)
