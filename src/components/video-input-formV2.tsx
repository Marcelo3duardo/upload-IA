import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Console } from "console";


export function VideoInputFormV2() {
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const promptInputRef = useRef<HTMLTextAreaElement>(null)



    async function convertVideoFile(video: File) {
        console.log("convert started")
        const [loaded, setLoaded] = useState(false);
        const ffmpegRef = useRef(new FFmpeg());
        const videoRef = useRef(null);
        const messageRef = useRef(null);
        // const ffmpeg = require("ffmpeg");


        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'
        const ffmpeg = ffmpegRef.current;
        // Listen to progress event instead of log.
        ffmpeg.on('progress', ({ progress, time }) => {
            console.log(`${progress * 100} % (transcoded time: ${time / 1000000} s)`);
        });
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setLoaded(true);




        await ffmpeg.writeFile("input.mp4", await fetchFile(video))
        await ffmpeg.exec([
            "-i",
            "input.mp4",
            "-map",
            "0:a",
            "libmp3lame",
            "-acodec",
            "-b:a",
            "20k",
            "output.mp3"
        ])

        const data = await ffmpeg.readFile('output.mp3')
        const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
        const audioFile = new File([audioFileBlob], 'audio.mp3', { type: 'audio/mpeg' })







        console.log("convert audio Finished")
        return audioFile

    }



    function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.currentTarget;
        if (!files) {
            return
        }
        const selectedFile = files[0]
        setVideoFile(selectedFile)

    }

    async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const prompt = promptInputRef.current?.value

        if (!videoFile) {
            return
        }

        //converter o video em audio 

        const audioFile = await convertVideoFile(videoFile)

        console.log(audioFile)
    }

    const previewURL = useMemo(() => {
        if (!videoFile) {
            return null
        }

        return URL.createObjectURL(videoFile)
    }, [videoFile])

    return (
        <form onSubmit={handleUploadVideo} className='space-y-6 '>

            <label
                htmlFor='video'
                className='flex border  aspect-video justify-center items-center  text-muted-foreground  border-dashed flex-col gap-2 cursor-pointer hover: bg-primary/5 '
            >

                {previewURL ? <video src={previewURL} controls={false} className=" pointer-events-none" /> :
                    <>
                        <FileVideo className='w-4 h-4 text-muted-foreground' />
                        Carregar video
                    </>}

            </label>
            <input type='file' id='video' accept='video/mp4' className='sr-only' onChange={handleFileSelect} />

            <Separator />

            <div className='space-y-1'>
                <Label htmlFor='transcription_prompt'>Prompt de transcrição</Label>
                <Textarea
                    ref={promptInputRef}
                    id='transcription_prompt'
                    className='h-20 leading-relaxed'
                    placeholder='Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)'
                ></Textarea>

            </div>

            <Button type="submit" className="w-full">
                Carregar video <Upload className='w-4 h-4 ml-2' />
            </Button>

        </form>

    )
}