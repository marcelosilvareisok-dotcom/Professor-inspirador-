'use client';

import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Lightbulb, GraduationCap } from 'lucide-react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const responseEndRef = useRef<HTMLDivElement>(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const streamResponse = await ai.models.generateContentStream({
        model: 'gemini-3.1-pro-preview',
        contents: question,
        config: {
          systemInstruction: `Você é um professor de matemática apaixonado e criativo. Sua missão não é apenas dar respostas, mas fazer o aluno entender o conceito por trás dos números. Use analogias do cotidiano, conte curiosidades históricas sobre os matemáticos e sempre incentive o aluno. Se ele errar, não dê a resposta, faça uma pergunta que o leve a perceber o erro. O aluno pediu: "Me explique como se eu tivesse 10 anos". Formate as fórmulas matemáticas usando LaTeX (envolva as fórmulas inline com $ e as de bloco com $$).`,
          temperature: 0.7,
        }
      });

      for await (const chunk of streamResponse) {
        setResponse((prev) => prev + (chunk.text || ''));
      }
    } catch (err: any) {
      console.error(err);
      setError(`Desculpe, ocorreu um erro ao tentar buscar a explicação. Detalhes: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 md:py-20 flex flex-col min-h-screen">
      {/* Header */}
      <header className="text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center p-4 bg-amber-100 text-amber-800 rounded-full mb-6 shadow-sm"
        >
          <GraduationCap className="w-10 h-10" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4"
        >
          Professor Inspirador
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600 max-w-2xl mx-auto"
        >
          A matemática não é sobre números, equações ou algoritmos: é sobre compreensão. Qual é a sua dúvida hoje?
        </motion.p>
      </header>

      {/* Input Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl shadow-sm border border-slate-200 p-2 mb-8 relative overflow-hidden focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-amber-400 transition-all"
      >
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ex: Por que a fórmula de Bhaskara funciona? ou O que são frações?"
          className="w-full min-h-[120px] p-4 bg-transparent resize-none outline-none text-slate-800 placeholder:text-slate-400 text-lg"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAsk();
            }
          }}
        />
        <div className="flex flex-col sm:flex-row justify-between items-center p-2 bg-slate-50 rounded-2xl mt-2 gap-4">
          <div className="flex items-center text-sm text-slate-500 px-2 w-full sm:w-auto">
            <Lightbulb className="w-4 h-4 mr-2 text-amber-500 flex-shrink-0" />
            <span>Pressione Enter para enviar</span>
          </div>
          <button
            onClick={handleAsk}
            disabled={isLoading || !question.trim()}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-sm"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Pensando...
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Me explique como se eu tivesse 10 anos
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Response Area */}
      <AnimatePresence>
        {(response || isLoading || error) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10"
          >
            <div className="flex flex-col sm:flex-row items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">Professor</h3>
                <p className="text-sm text-slate-500 mb-6">Sempre pronto para ajudar</p>
                
                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 mb-4">
                    {error}
                  </div>
                )}

                <div className="prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-a:text-amber-600 hover:prose-a:text-amber-700">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {response}
                  </ReactMarkdown>
                  
                  {isLoading && !response && (
                    <div className="flex space-x-2 items-center h-8 mt-4">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
                <div ref={responseEndRef} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
