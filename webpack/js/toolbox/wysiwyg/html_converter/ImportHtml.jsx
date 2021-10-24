import {BlockTypes} from '../BlockTypes.jsx'
import {InlineMap} from '../InlineMap.jsx'

const c = "<p>bla Lorem Ipsum is <p>simply dummy</p> text of the printing <div style='font-weight: bold'>and</div> typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it <a href='/'>to make</a> a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p><b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. <i>It has survived not only five centuries</i>, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of <span style='font-weight: bold'>Lorem Ipsum</span>.</p>"

export default function importHtml(content)  {
    if (typeof content === 'undefined' || content === '') {
        return false;
    }

    let parser = new Parser(c);
    parser.process();
}

class Parser {
    constructor(content) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(content, "text/html");
        this.body = doc.body;
    }

    process() {
        let nodes = this.body.childNodes;
        for (let i = 0; i < nodes.length; i++) {
            this.processElement(nodes[i]);
        }
    }

    processElement(element) {
        console.log(element)
    }
}
