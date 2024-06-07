// sqlGenerator.test.js

import sqlGenerator from '../utils/sqlGenerator';

const {
    generateCreateAndInsertStatements,
    generateInClausesFromPaste,
    generateFullInClause,
    breakIntoChunks,
    generateCreateTableSQL,
    generateInsertStatements,
    generateInsertIntoClause,
    generateInsertLine,
    isEndOfStatement,
    isFirstLineOfStatement,
    validBatchSize
  } = sqlGenerator;

describe('SQL Generator Functions', () => {

  test('generateCreateAndInsertStatements', () => {
    const data = [
      ['id', 'name'],
      [1, 'John'],
      [2, 'Jane']
    ];
    const fields = [
      { name: 'id', type: 'INT', include: true },
      { name: 'name', type: 'VARCHAR(255)', include: true }
    ];
    const tableName = 'users';
    const tableType = 'TEMP';
    const batchSize = 1;

    const result = sqlGenerator.generateCreateAndInsertStatements(data, fields, tableName, tableType, batchSize);
    
    expect(result).toEqual(expect.arrayContaining([
      'CREATE TEMP TABLE "users" ("id" INT, "name" VARCHAR(255));',
      '\n\nINSERT INTO "users" VALUES\n\t(\'1\', \'John\');\n\nINSERT INTO "users" VALUES\n\t(\'2\', \'Jane\');'
    ]));
  });

  test('generateInClausesFromPaste', () => {
    const jsonData = [[1, 2], [3, 4]];
    const batchSize = 2;

    const result = sqlGenerator.generateInClausesFromPaste(jsonData, batchSize);

    expect(result).toEqual([
      ["'1'", "'2'"],
      ["'3'", "'4'"]
    ]);
  });

  test('generateFullInClause', () => {
    const chunkedDataPoints = [["'1'", "'2'"], ["'3'", "'4'"]];
    const notIn = false;
    const attributeName = 'id';

    const result = sqlGenerator.generateFullInClause(chunkedDataPoints, notIn, attributeName);

    expect(result).toEqual(
      '(\n\t"id" IN ( \n\t\t\'1\',\n\t\t\'2\'\n\t)\n\nOR "id" IN ( \n\t\t\'3\',\n\t\t\'4\'\n\t)\n)'
    );
  });

  test('breakIntoChunks', () => {
    const allDataPoints = [1, 2, 3, 4, 5];
    const batchSize = 2;

    const result = sqlGenerator.breakIntoChunks(allDataPoints, batchSize);

    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  test('generateCreateTableSQL', () => {
    const fields = [
      { name: 'id', type: 'INT', include: true },
      { name: 'name', type: 'VARCHAR(255)', include: true }
    ];
    const tableName = 'users';
    const tableType = 'TEMP';

    const result = sqlGenerator.generateCreateTableSQL(fields, tableName, tableType);

    expect(result).toBe('CREATE TEMP TABLE "users" ("id" INT, "name" VARCHAR(255));');
  });

  test('generateInsertStatements', () => {
    const data = [
      ['id', 'name'],
      [1, 'John'],
      [2, 'Jane']
    ];
    const fields = [
      { name: 'id', type: 'INT', include: true },
      { name: 'name', type: 'VARCHAR(255)', include: true }
    ];
    const tableName = 'users';
    const batchSize = 1;

    const result = sqlGenerator.generateInsertStatements(data, fields, tableName, batchSize);

    expect(result).toBe(
      '\n\nINSERT INTO "users" VALUES\n\t(\'1\', \'John\');\n\nINSERT INTO "users" VALUES\n\t(\'2\', \'Jane\');'
    );
  });

  test('isEndOfStatement', () => {
    expect(sqlGenerator.isEndOfStatement(5, 4, 2)).toBe(true);
    expect(sqlGenerator.isEndOfStatement(5, 2, 2)).toBe(false);
    expect(sqlGenerator.isEndOfStatement(5, 4, null)).toBe(true);
  });

  test('isFirstLineOfStatement', () => {
    expect(sqlGenerator.isFirstLineOfStatement(0, 2)).toBe(true);
    expect(sqlGenerator.isFirstLineOfStatement(2, 2)).toBe(true);
    expect(sqlGenerator.isFirstLineOfStatement(1, 2)).toBe(false);
  });

  test('validBatchSize', () => {
    expect(sqlGenerator.validBatchSize(2)).toBe(true);
    expect(sqlGenerator.validBatchSize(-1)).toBe(false);
    expect(sqlGenerator.validBatchSize(null)).toBe(false);
  });

});
