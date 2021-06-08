import { TestScenario } from "../TestScenario";

export class Reporter {
    testScenario: TestScenario;

    constructor(testScenario: TestScenario) {
        this.testScenario = testScenario;
    }
}
