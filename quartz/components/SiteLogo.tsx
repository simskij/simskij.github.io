import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function SiteLogo({ cfg, fileData }: QuartzComponentProps) {
  const ogImagePath = `/static/me.png`
  return <div><a href="/"><img class="site-logo" style="max-width: 200px;" src={ogImagePath} alt="Return to Home Page"></img></a></div>
}
SiteLogo.css = `
.site-logo {
  margin: .5rem;
  text-align: center;
}
`

export default (() => SiteLogo) satisfies QuartzComponentConstructor