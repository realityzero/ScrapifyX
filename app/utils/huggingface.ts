import { config } from "../../config";
import { FeatureExtractionOutput, HfInference } from "@huggingface/inference";

export class HuggingFace {
    private _hf;

    constructor() {
        this._hf = new HfInference(config.huggingface.apiKey);
    }

    async generateEmbedding(dataChunk: string): Promise<FeatureExtractionOutput> {
        const vectorEmbedding = this._hf.featureExtraction({
            model: config.huggingface.model,
            inputs: dataChunk.replace(/\n/g, " ")
        });
        return vectorEmbedding;
    }
}