import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.MODEL ?? 'gpt-4o-mini';

type Categoria = 'Digital' | 'Pessoa' | 'Lugar' | 'Coisa' | 'Ano';

const ACOES = [
  'Perca sua vez',
  'Avance 1 casa', 'Avance 2 casas', 'Avance 3 casas',
  'Volte 1 casa', 'Volte 2 casas', 'Volte 3 casas',
  'Ganhe uma ficha azul'
];

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    categoria: { type: 'string' },
    resposta: { type: 'string' },
    linhas: {
      type: 'array',
      minItems: 20,
      maxItems: 20,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          tipo: { enum: ['dica','acao'] },
          texto: { type: 'string' },
          dificuldade: { enum: ['facil','media','dificil', 'n/a'] }
        },
        required: ['tipo','texto','dificuldade']
      }
    }
  },
  required: ['categoria','resposta','linhas']
};

function buildSystemPrompt() {
  return [
    'Você é um gerador de cartas estilo Perfil 7.',
    'Formato final: exatamente 20 linhas numeradas; cada linha pode ser uma DICA ou uma AÇÃO.',
    'Distribuição: 14–16 DICAs e 4–6 AÇÕEs, em ordem aleatória.',
    'A dificuldade das DICAs deve ser misturada (fácil, média, difícil) sem ordem previsível.',
    'Evite falar a resposta literalmente nas primeiras 10 linhas.',
    'A resposta pode “entregar” entre as linhas 14–20 (não necessariamente a última).',
    'Não use o nome da resposta nas dicas iniciais; use descrições, fatos, pistas.',
    'Ações permitidas exatamente como: "Perca sua vez", "Avance X casas", "Volte X casas", "Ganhe uma ficha azul".'
  ].join('\n');
}

function buildUserPrompt(categoria: Categoria, resposta?: string) {
  return [
    `Categoria: ${categoria}`,
    resposta ? `Resposta final (obrigatória): ${resposta}` : 'Escolha uma resposta adequada e popular para a categoria.',
    'Produza 20 linhas com variedade, sem ordem de dificuldade, com tom fiel ao jogo.',
  ].join('\n');
}

app.post('/cards', async (req, res) => {
  try {
    const categoria: Categoria = req.body?.categoria ?? ['Digital','Pessoa','Lugar','Coisa','Ano'][Math.floor(Math.random()*5)] as Categoria;
    const resposta: string | undefined = req.body?.resposta;

    const response = await openai.responses.create({
      model: MODEL,
      response_format: { type: 'json_schema', json_schema: { name: 'Perfil7Card', schema } },
      input: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(categoria, resposta) },
        { role: 'user', content: 'Exemplo de AÇÃO: "Avance 2 casas". Exemplo de DICA: "Sou usado para pagamentos instantâneos no Brasil".' }
      ],
    });

    const json = JSON.parse(response.output[0].content[0].text) as {
      categoria: string; resposta: string;
      linhas: { tipo:'dica'|'acao'; texto:string; dificuldade:'facil'|'media'|'dificil'|'n/a'}[];
    };

    let linhas = json.linhas.map(l => {
      if (l.tipo === 'acao') {
        const match = ACOES.find(a => l.texto.toLowerCase().startsWith(a.toLowerCase()));
        return { ...l, texto: match ?? 'Perca sua vez', dificuldade: 'n/a' };
      }
      return l;
    });

    linhas = linhas
      .map(v => ({ v, r: Math.random() }))
      .sort((a,b)=>a.r-b.r)
      .map(({v})=>v)
      .slice(0,20);

    res.json({ categoria: json.categoria, resposta: json.resposta, linhas });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message ?? 'Erro ao gerar carta' });
  }
});

app.listen(process.env.PORT ?? 3001, () => {
  console.log(`Perfil7 IA rodando na porta ${process.env.PORT ?? 3001}`);
});
