import { classNames } from "../util/lang";
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function SiteLogo({ cfg, fileData, displayClass }: QuartzComponentProps) {
  const ogImagePath = `/static/me.png`;
  return <div class={classNames(displayClass, "site-logo")}>
    <a href="/">
      <img src={ogImagePath} alt="Return to Home Page"/>
    </a>
  </div>
}
SiteLogo.css = `
.site-logo {
  margin: .5rem;
  text-align: center;
  max-width: 200px;
}
`

export default (() => SiteLogo) satisfies QuartzComponentConstructor