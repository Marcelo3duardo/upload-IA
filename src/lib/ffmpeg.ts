// Este arquivo contém a implementação da lib ffmpeg para o projeto.
// Essa implementação utiliza a biblioteca @ffmpeg/ffmpeg para garantir compatibilidade com diferentes ambientes.

import { FFmpeg } from '@ffmpeg/ffmpeg'

// Importa as URLs necessárias para carregar os arquivos core e wasm, que são necessários para funcionamento da lib ffmpeg.
import coreURL from '@/ffmpeg/ffmpeg-core.js?url'
import wasmURL from '@/ffmpeg/ffmpeg-core.wasm?url'
import workerURL from '@/ffmpeg/ffmpeg-worker.js?url'

let ffmpeg: FFmpeg | null // Variável que armazena uma instância da lib ffmpeg.

/**
 * Função assíncrona que retorna uma instância da lib ffmpeg carregada e pronta para uso.
 * Caso essa instância já esteja carregada (ou seja, não seja nula), é retornada como está.
 * Se não estiver carregada, é criada uma nova instância e carregada ou inicializada com base nas URLs passadas.
 */
export async function getFFmpeg() {
    // Verifica se a instância da lib ffmpeg já foi inicializada ou não.
    if (ffmpeg) return ffmpeg // Nesse caso, é retornada a instância que já está carregada.

    // Inicializa um novo objeto da classe FFmpeg.
    ffmpeg = new FFmpeg()

    // Verifica se a instância está carregada.
    if (!ffmpeg.loaded) {
        try {
            // Chama o método load, fornecendo as URLs necessárias para carregar os arquivos core e wasm.
            // O método load inicializa o ffmpeg pode assumir vários atributos.
            await ffmpeg.load({
                coreURL, // URL para carregar o arquivo core.
                wasmURL, // URL para carregar o arquivo wasm.
                workerURL // URL para carregar o arquivo worker que processa em background.
            })
        } catch (error) {
            // Em caso de erro ao carregar o ffmpeg, deve ser tratado e o erro solucionado, para evitar quebras de sistema.
        }
    }

    // Retorna a instância do ffmpeg carregada e pronta para uso.
    return ffmpeg
}
