export class FeatureScenario {
  name: string
  tags: string[]

  constructor(name: string, tags: string[]) {
    this.name = name;
    this.tags = tags;
  }
}
