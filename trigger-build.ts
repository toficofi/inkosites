import { getAccount} from "./database";
import { triggerBuild } from "./netlify";

const main = async () => {
    const account = await getAccount("megan")
    triggerBuild(account!)
}

main()