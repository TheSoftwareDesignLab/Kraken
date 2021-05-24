const fs = require("fs")
var Gherkin = require("@cucumber/gherkin")
var Messages = require("@cucumber/messages")

export class FeatureFile {
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    var uuidFn: any = Messages.IdGenerator.uuid();
    var builder = new Gherkin.AstBuilder(uuidFn);
    var matcher: any = new Gherkin.TokenMatcher();
    var parser: any = new Gherkin.Parser(builder, matcher);
    let content: string = fs.readFileSync(this.filePath,'utf8');
    var gherkinDocument: any = parser.parse(content);
    console.log(gherkinDocument);
    console.log(gherkinDocument.feature.children[0].scenario.tags[1].name);
  }
}
