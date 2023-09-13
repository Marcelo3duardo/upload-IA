

import './App.css'
import { Button } from './components/ui/button'
import { FileVideo, Github, Upload, Wand2 } from 'lucide-react'
import { Separator } from './components/ui/separator'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Slider } from './components/ui/slider'

export function App() {


  return (
    <div className=" min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b ">
        <h1 className="text-xl font-bold">upload<span className="text-blue-500">.</span>ia</h1>
        <div className=" flex items-center gap-3 ">
          <span className="text-sm text-muted-foreground ">Desenvolvido no NLW IA 🚀</span>
          <Separator orientation='vertical' className="h-6 text-muted-foreground" />
          <Button variant="outline">
            <Github className='w-4 h-4 mr-2' />
            GitHub
          </Button>
        </div>
      </div>
      <main className=" flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className='resize-none p-5 leading-relaxed'
              placeholder='Inclua o Prompt para a IA...'
            />

            <Textarea
              className='resize-none p-5 leading-relaxed'
              placeholder='Resultado gerado pela IA' readOnly
            />

          </div>

          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variavel <code className="text-violet-500"> {'{transcription}'} </code> no seu prompt para adicionar conteúdo da transcrição do video selecionado
          </p>

        </div>
        <aside className='w-80 space-y-6'>
          <form className='space-y-6 '>

            <label
              htmlFor='video'
              className='flex border  aspect-video justify-center items-center  text-muted-foreground  border-dashed flex-col gap-2 cursor-pointer hover: bg-primary/5 '
            >

              <FileVideo className='w-4 h-4 text-muted-foreground' />

              Carregar video

            </label>
            <input type='file' id='video' accept='video/mp4' className='sr-only' />

            <Separator />

            <div className='space-y-1'>
              <Label htmlFor='transcription_prompt'>Prompt de transcrição</Label>
              <Textarea
                id='transcription_prompt'
                className='h-20 leading-relaxed'
                placeholder='Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)'
              ></Textarea>

            </div>

            <Button type="submit" className="w-full">
              Carregar video <Upload className='w-4 h-4 ml-2' />
            </Button>

          </form>

          <Separator />

          <form className='space-y-6'>
            <div className='space-y-2'>
              <Label>Prompt</Label>
              <Select >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione um Prompt'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Titulo"> Titulo para o YouTube</SelectItem>
                  <SelectItem value="Descrição"> Descrição para o YouTube</SelectItem>
                </SelectContent>
              </Select>
              {/* <span className='block text-muted-foreground text-sm' > Podera mudar em breve  </span> */}

            </div>



            <div className='space-y-2'>
              <Label>Modelo</Label>
              <Select disabled defaultValue='gpt3.5'>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5"> GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className='block text-muted-foreground text-sm' > Podera mudar em breve  </span>

            </div>

            <Separator />

            <div className='space-y-2'>
              <Label>Temperatura</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
              />
              <span className='block text-xs text-muted-foreground italic leading-relaxed'>
                Valores mais altos tendem a deixar o resultado mais criativo mas podem ocorrer possiveis erros
              </span>
            </div>

            <Separator />

            <Button type='submit' className='w-full'>
              Executar
              <Wand2 className='w-4 h-4 ml-2' />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}


