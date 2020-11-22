import express from 'express';
const router = express.Router();
import { promises as fs } from 'fs';
const { readFile, writeFile } = fs;

router.post('/', async (req, res, next) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(global.fileName));
    account = { id: data.NextAccountId++, ...account };
    data.Accounts.push(account);
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(account);
  } catch (error) {
    next(error);
  }
});
router.get('/', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.NextAccountId;
    res.send(data);
  } catch (error) {
    next(error);
  }
});
router.get('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const found = data.Accounts.find(
      (x) => x.NextAccountId === parseInt(req.params.NextAccountId)
    );
    res.send(found);
  } catch (error) {
    next(error);
  }
});
router.delete('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    if (!data.Accounts.find((x) => x === data.Accounts.id)) {
      logger.info('index not found!!!');
    }
    data.Accounts = data.Accounts.filter(
      (x) => x.id !== parseInt(req.params.id)
    );
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(data);
  } catch (error) {
    next(error);
  }
});
router.put('/', async (req, res, next) => {
  try {
    const account = req.body;
    if (!account.name || account.balance == null) {
      throw new Error('Name and balance must be entered!');
    }
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.Accounts.findIndex((x) => x.id == account.id);

    data.Accounts[index].name = account.name;
    data.Accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(account);
    logger.info(`Put/account - ${JSON.stringify(account)}`);
  } catch (error) {
    next(error);
  }
});
router.use((error, req, res, next) => {
  logger.info(`${req.method} ${req.baseUrl} - ${error.message} `);
  res.status(400).send({ error: error.message });
});
export default router;
