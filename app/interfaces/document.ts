export interface ChunkedDocument {
    content: string;
    title: string;
    url: string;
}

export interface TopKResults {
    id:       string;
    score:    number;
    values:   any[];
    metadata: Metadata;
}

export interface Metadata {
    loc:         string;
    pageContent: string;
    txtPath:     string;
}
