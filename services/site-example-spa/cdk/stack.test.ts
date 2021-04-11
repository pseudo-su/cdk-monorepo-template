// import {
//   expect as expectCDK,
//   matchTemplate,
//   MatchStyle,
// } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as moduleUnderTest from "./static-site";
import { test, expect } from "@jest/globals";

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new moduleUnderTest.StaticSiteStack(app, "MyTestStack", {});
  // THEN
  // expectCDK(stack).to(
  //   matchTemplate(
  //     {
  //       Resources: {},
  //     },
  //     MatchStyle.EXACT,
  //   ),
  // );
  expect(stack.stackName).toBe("MyTestStack");
});
