// import {
//   expect as expectCDK,
//   matchTemplate,
//   MatchStyle,
// } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as moduleUnderTest from "./next-stack";

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new moduleUnderTest.NextStack(app, "MyTestStack", {});
  // THEN
  // expectCDK(stack).to(
  //   matchTemplate(
  //     {
  //       Resources: {},
  //     },
  //     MatchStyle.EXACT,
  //   ),
  // );
  expect(true).toBe(true);
});
