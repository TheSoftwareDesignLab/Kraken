import { FeatureScenario } from './FeatureScenario';
const fs = require("fs");
var Gherkin = require("@cucumber/gherkin");
var Messages = require("@cucumber/messages");

export class FeatureFile {
  filePath: string;
  scenarios: FeatureScenario[];

  constructor(filePath: string) {
    this.filePath = filePath;
    this.scenarios = [];
    this.readContent();
  }

  readContent() {
    const content = this.gherkinDocument();
    const feature = content.feature;
    feature.children.forEach((featureChild: any) => {
      this.scenarios.push(
        new FeatureScenario(
          featureChild.scenario.name,
          featureChild.scenario.tags.map((tag: any) => (tag.name))
        )
      )
    })
  }

  requiredDevicesInfo() {
    let userTags: string[] = this.userTags();
    let systemTags: string[] = this.systemTags();

    return userTags.map((userTag) => {
      return {
        user_id: userTag.split('@user').join(''),
        system_type: systemTags.shift() || '@mobile'
      }
    });
  }

  private userTags(): string[] {
    let allScenariosTags: string[][] = this.scenarios.map(
      (scenario) => (scenario.tags)
    );
    let allTags: string[] = ([] as string[]).concat.apply([] as string[], allScenariosTags);
    let uniqueTags: string[] = allTags.filter((tag, index, self) => {
      return self.indexOf(tag) === index;
    });

    return uniqueTags.filter((tag) => {
      return tag.startsWith('@user');
    });
  }

  private systemTags(): string[] {
    return this.scenarios.map((scenario) => {
      let tags: string[] = scenario.tags;
      let systemTag: any = tags.find((tag) => {
        return tag.startsWith('@mobile') || tag.startsWith('@web')
      });
      return systemTag || '@mobile';
    })
  }

  private gherkinDocument(): any {
    const uuidFn: any = Messages.IdGenerator.uuid();
    const builder = new Gherkin.AstBuilder(uuidFn);
    const matcher: any = new Gherkin.TokenMatcher();
    const parser: any = new Gherkin.Parser(builder, matcher);
    const content: string = fs.readFileSync(this.filePath,'utf8');
    return parser.parse(content);
  }
}
