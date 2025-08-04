export class ResData<T> {
    constructor(
        public message: string,
        public status: number,
        public data?: T,
        public error?: string,
    ) { }
}
