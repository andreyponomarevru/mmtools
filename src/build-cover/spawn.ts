import { spawn } from "child_process";

export type SpawnProcess = {
  buildDir: string;
  extractedCoversDir: string;
  photoPath: string;
  date: string;
  coversCount: number;
};

export async function spawnBuildCoversScript(
  scriptPath: string,
  { buildDir, extractedCoversDir, photoPath, date, coversCount }: SpawnProcess
) {
  const scriptArgs = [
    buildDir,
    photoPath,
    date,
    extractedCoversDir,
    String(coversCount),
  ];
  const bash = spawn("bash", [scriptPath, ...scriptArgs]);
  bash.stdout.on("data", (data) => console.log(`stdout: ${data}`));
  bash.stderr.on("data", (data) => console.error(`stderr: ${data}`));
  bash.on("close", (code) =>
    console.log(`child process exited with code ${code}`)
  );
}
