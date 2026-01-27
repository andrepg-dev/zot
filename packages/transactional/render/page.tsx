import { pretty, render } from '@react-email/render'
import React from 'react'
import Emails from "../emails/emails"

export default async function RenderPage() {

  const html = await pretty(await render(<Emails />))

  return (
    <>{html}</>
  )
}
