declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  import { AnimationClip, Group, LoadingManager, Loader } from 'three'
  import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

  export interface GLTF {
    scene: Group
    scenes: Group[]
    animations: AnimationClip[]
    parser: any
    userData: any
  }

  export class GLTFLoader extends Loader {
    constructor(manager?: LoadingManager)
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (event: ErrorEvent | Error) => void,
    ): void
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: GLTF) => void,
      onError?: (event: ErrorEvent | Error) => void,
    ): void
    setDRACOLoader(dracoLoader: DRACOLoader): this
  }
}

declare module 'three/examples/jsm/loaders/DRACOLoader.js' {
  import { LoadingManager, Loader } from 'three'

  export class DRACOLoader extends Loader {
    constructor(manager?: LoadingManager)
    setDecoderPath(path: string): this
    decodeDracoFile(
      buffer: ArrayBuffer,
      callback: (geometry: any) => void,
      attributeIDs?: Record<string, number>,
      attributeTypes?: Record<string, number>,
    ): void
    dispose(): void
  }
}
