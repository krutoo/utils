import type { RuleSetRule, RuleSetRules } from '@rspack/core';
import type { RuleInsertOptions } from './types.ts';

/**
 * Inserts rule to array in way according to config.
 * @param rule Rule.
 * @param options Insert options.
 * @param rules Array to insert.
 */
export function insertRule(
  rule: RuleSetRule,
  { ruleInsert = 'to-end' }: RuleInsertOptions,
  rules: RuleSetRule[] | RuleSetRules,
): void {
  if (ruleInsert === 'to-start') {
    rules.unshift(rule);
  }

  if (ruleInsert === 'to-end') {
    rules.push(rule);
  }
}
