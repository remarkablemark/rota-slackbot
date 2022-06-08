import { model, Schema } from 'mongoose';

export interface Rota {
  name: string;
  description?: string;
  assigned?: string;
  staff?: string[];
}

/**
 * ROTA SCHEMA
 */
const rotaSchema = new Schema<Rota>({
  name: { type: String, required: true },
  description: String,
  assigned: String,
  staff: [String],
});

export default model<Rota>('Rota', rotaSchema);
