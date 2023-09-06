export class CustomElement extends HTMLElement {
    constructor() {
        super();
        this.tempID = '';
        this.attachShadow({ mode: 'open' });
    }
    applyStyle() {
        let parentClass = Object.getPrototypeOf(Object.getPrototypeOf(this));
        let parentClassName = parentClass.constructor.name;
        let parentStyles = [];
        while (parentClassName !== 'HTMLElement') {
            let newStyle = document.createElement('link');
            newStyle.rel = "stylesheet";
            newStyle.href = `./styles/${parentClassName}.css`;
            parentStyles.push(newStyle);
            parentClass = Object.getPrototypeOf(parentClass);
            parentClassName = parentClass.constructor.name;
        }
        parentStyles.reverse().forEach(style => this.shadowRoot.appendChild(style));
        let newStyle = document.createElement('link');
        newStyle.rel = "stylesheet";
        newStyle.href = `./styles/${this.constructor.name}.css`;
        this.shadowRoot.appendChild(newStyle);
    }
    connectedCallback() {
        var _a;
        this.applyStyle();
        const template = (_a = document.querySelector(`#${this.tempID}-template`)) === null || _a === void 0 ? void 0 : _a.content;
        if (template)
            this.shadowRoot.appendChild(template.cloneNode(true));
    }
}
customElements.define('ce-custom-element', CustomElement);
//# sourceMappingURL=CustomElement.js.map