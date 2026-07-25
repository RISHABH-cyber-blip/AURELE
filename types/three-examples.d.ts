declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  import { AnimationClip, Group, LoadingManager, Loader } from 'three'

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
  }
}
