/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const { rimraf } = require('rimraf');

const QUESTIONS_DIR = path.join(__dirname, 'public', 'questions_raw');
const ANSWERS_DIR = path.join(__dirname, 'public', 'answers_raw');

const OUT_QUESTIONS_DIR = path.join(__dirname, 'public', 'questions');
const OUT_ANSWERS_DIR = path.join(__dirname, 'public', 'answers');

const optimize = async (dir, outDir) => {
  const files = (await fs.readdir(dir)).filter((file) => file.endsWith('.png'));

  const written = await Promise.all(files.map(async (file) => {
    const name = file.split('.')[0];
    const filePath = path.join(dir, file);

    const out = await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(path.join(outDir, `${name}.webp`));
    // eslint-disable-next-line no-console
    console.log(`Wrote ${name}.webp`);
    return out;
  }));

  return written;
};

const main = async () => {
  if (await fs.lstat(OUT_QUESTIONS_DIR).catch(() => false)) {
    await rimraf(OUT_QUESTIONS_DIR);
  }

  if (await fs.lstat(OUT_ANSWERS_DIR).catch(() => false)) {
    await rimraf(OUT_ANSWERS_DIR);
  }

  await Promise.all([
    await fs.mkdir(OUT_QUESTIONS_DIR),
    await fs.mkdir(OUT_ANSWERS_DIR)
  ]);

  await Promise.all([
    optimize(QUESTIONS_DIR, OUT_QUESTIONS_DIR),
    optimize(ANSWERS_DIR, OUT_ANSWERS_DIR),
  ]);
};

main();