import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress"

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from '@/lib/ffmpeg'
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";


export function VideoInputForm() {
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [progressBar , setProgressBar] = useState<number>(0)
    const promptInputRef = useRef<HTMLTextAreaElement>(null)

    async function convertVideoFile(video: File) {
        console.log("convert started")

        // const ffmpeg = require("ffmpeg");

        try {
            const ffmpeg = await getFFmpeg()


            await ffmpeg.writeFile("input.mp4", await fetchFile(video))

            console.log("log 1")
            // ffmpeg.on('log', log => {
            //     console.log(log)
            // })

            ffmpeg.on('progress', progress => {

                setProgressBar(Math.round(progress.progress * 100))
                
            })
            console.log("log 2")

            await ffmpeg.exec([
                '-i',
                'input.mp4',
                '-map',
                '0:a',
                '-b:a',
                '20k',
                '-acodec',
                'libmp3lame',
                'output.mp3'
            ])

          
            const data = await ffmpeg.readFile('output.mp3')
            
            const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
            
            const audioFile = new File([audioFileBlob], 'audio.mp3', {
                type: 'audio/mpeg'
            })

            console.log('Convert finished.')


            //converter audio em texto 

            return audioFile
        } catch (error) {
            console.log(error)
        }




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

        const data = new FormData()
        
        audioFile ? data.append('file', audioFile) : console.error('audioFile is null or undefined')
        console.log(audioFile, prompt)
        const response = await api.post('/videos', data, )
        console.log(response.data)
        const videoID = response.data.video.id
        await api.post(`/videos/${videoID}/transcription`, { prompt })
        console.log("Finalizou")

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
            <Progress value={progressBar} />


        </form>

    )
}