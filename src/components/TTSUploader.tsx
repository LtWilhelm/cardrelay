import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface IProps {
  setTTSFile: Dispatch<
    SetStateAction<{ ObjectStates: TTSObjectState[] } | undefined>
  >;
}

export function TTSUploader({ setTTSFile }: IProps) {
  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (!file.name.endsWith(".json")) return;
    const fileText = await readBlob(file);
    if (!fileText) return;
    const ttsFile = JSON.parse(fileText);
    setTTSFile(ttsFile);
  }

  function readBlob(file: File) {
    return new Promise<string>((res) => {
      const reader = new FileReader();

      reader.onload = (e) => res(e.target?.result as string);

      reader.readAsText(file);
    });
  }

  return <input type="file" onChange={onChange} accept=".json" />;
}
