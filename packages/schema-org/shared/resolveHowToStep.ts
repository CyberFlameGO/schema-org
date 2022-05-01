import { defu } from 'defu'
import type { Arrayable, IdReference, SchemaNodeInput, Thing } from '../types'
import type { VideoObject } from '../defineVideo'
import { resolveWithBaseUrl, resolver } from '../utils'
import type { ImageInput } from './resolveImages'
import { resolveImages } from './resolveImages'

export interface HowToDirection extends Thing {
  /**
   * The text of the direction or tip.
   */
  text: string
}

export interface HowToStep extends Thing {
  /**
   * A link to a fragment identifier (an 'ID anchor') of the individual step
   * (e.g., https://www.example.com/example-page/#recipe-step-5).
   */
  url?: string
  /**
   * The instruction string
   * ("e.g., "Bake at 200*C for 40 minutes, or until golden-brown, stirring periodically throughout").
   */
  text: string
  /**
   * The word or short phrase summarizing the step (for example, "Attach wires to post" or "Dig").
   * Don't use non-descriptive text (for example, "Step 1: [text]") or other form of step number (for example, "1. [text]").
   */
  name?: string
  /**
   * An image representing the step, referenced by ID.
   */
  image?: ImageInput
  /**
   * A video for this step or a clip of the video.
   */
  video?: VideoObject | IdReference
  /**
   * A list of detailed substeps, including directions or tips.
   */
  itemListElement?: HowToDirection[]
}

export type HowToStepInput = SchemaNodeInput<HowToStep>

export function resolveHowToStep(input: Arrayable<HowToStepInput>) {
  return resolver<HowToStepInput, HowToStep>(input, (input, { canonicalUrl }) => {
    const step = defu(input as unknown as HowToStep, {
      '@type': 'HowToStep',
    }) as HowToStep
    if (step.url)
      step.url = resolveWithBaseUrl(canonicalUrl, step.url)
    if (step.image)
      step.image = resolveImages(step.image)
    if (step.itemListElement)
      step.itemListElement = resolveHowToDirection(step.itemListElement) as HowToDirection[]
    return step
  })
}

export function resolveHowToDirection(input: Arrayable<HowToDirection>) {
  return resolver<HowToDirection, HowToDirection>(input, (input) => {
    return defu(input as unknown as HowToDirection, {
      '@type': 'HowToDirection',
    }) as HowToStep
  })
}
