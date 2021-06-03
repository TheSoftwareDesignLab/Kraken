import { TestScenario } from '../TestScenario';
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
    let userTags: string[] = this.uniqueUserTags();
    let systemTags: string[] = this.systemTags();

    return userTags.map((userTag) => {
      return {
        userId: userTag.split('@user').join(''),
        systemType: systemTags.shift() || '@mobile'
      }
    });
  }

  numberOfRequiredMobileDevices(): number {
    let tags: string[] = this.systemTags();
    return tags.filter((tag) => {
      return tag === '@mobile';
    }).length;
  }

  numberOfRequiredWebDevices(): number {
    let tags: string[] = this.systemTags();
    return tags.filter((tag) => {
      return tag === '@web';
    }).length;
  }

  numberOfRequiredDevices(): number {
    return this.uniqueUserTags().length;
  }

  has_right_syntax(): Boolean {
    return this.all_scenarios_have_a_user_tag() && !this.has_duplicate_tags_for_a_user();
  }

  has_duplicate_tags_for_a_user(): Boolean {
    let tags = this.allUserTags();
    for(var i: number = 0; i < tags.length; i++) {
      for(var j: number = i+1; j < tags.length; j++) {
        if(i === j) {
          continue;
        }

        if(tags[i] === tags[j]) {
          return true;
        }
      }
    }
    return false;
  }

  all_scenarios_have_a_user_tag(): Boolean {
    let emptyUserTagScenarios = this.scenarios.filter((scenario: FeatureScenario) => {
      let userTags: String[] = scenario.tags.filter((tag: string) => {
        return tag.startsWith('@user');
      });
      return userTags.length === 0;
    });
    return emptyUserTagScenarios.length === 0;
  }

  private allTags(): string[] {
    let allScenariosTags: string[][] = this.scenarios.map(
      (scenario) => (scenario.tags)
    );
    return ([] as string[]).concat.apply([] as string[], allScenariosTags);
  }

  private allUserTags(): string[] {
    let allTags: string[] = this.allTags();
    return allTags.filter((tag) => {
      return tag.startsWith('@user');
    });
  }

  private uniqueUserTags(): string[] {
    let allTags: string[] = this.allTags();
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
