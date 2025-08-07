import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Middleware para validar requisições usando schemas Zod
 * @param schema Schema Zod para validação
 */
export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Não valida body em métodos GET
    if (req.method === 'GET') {
      return next();
    }
    try {
      // Log do conteúdo recebido para diagnóstico
      console.log('validateRequest - Dados recebidos:');
      console.log('Body:', JSON.stringify(req.body, null, 2));
      console.log('Content-Type:', req.headers['content-type']);
      
      // Verificar se os dados estão em formato de string e tentar converter
      let bodyToValidate = req.body;
      if (typeof req.body === 'string') {
        try {
          bodyToValidate = JSON.parse(req.body);
          console.log('Body convertido de string para objeto no validateRequest');
          // Atualizar o req.body para que os controladores recebam o objeto
          req.body = bodyToValidate;
        } catch (error) {
          console.error('Erro ao converter body de string para objeto no validateRequest:', error);
        }
      }
      
      // Verificar se o body está vazio (pode acontecer em certas configurações)
      if (!bodyToValidate || Object.keys(bodyToValidate).length === 0) {
        console.error('Body vazio ou inválido recebido');
        return res.status(400).json({
          status: 'error',
          message: 'Dados de entrada vazios ou inválidos',
        });
      }
      
      // Mapeamento de campos do frontend para o backend (se necessário)
      // Campos para veículos
      if (!bodyToValidate.licensePlate && bodyToValidate.placa) {
        console.log('Mapeando placa para licensePlate no validateRequest');
        bodyToValidate.licensePlate = bodyToValidate.placa.trim().toUpperCase().replace(/\s/g, '');
      }
      
      if (!bodyToValidate.vehicleType && bodyToValidate.tipo) {
        console.log('Mapeando tipo para vehicleType no validateRequest');
        bodyToValidate.vehicleType = bodyToValidate.tipo;
      }
      
      if (!bodyToValidate.brand && bodyToValidate.marca) {
        console.log('Mapeando marca para brand no validateRequest');
        bodyToValidate.brand = bodyToValidate.marca;
      }
      
      if (!bodyToValidate.model && bodyToValidate.modelo) {
        console.log('Mapeando modelo para model no validateRequest');
        bodyToValidate.model = bodyToValidate.modelo;
      }
      
      if (!bodyToValidate.year && bodyToValidate.ano) {
        console.log('Mapeando ano para year no validateRequest');
        bodyToValidate.year = Number(bodyToValidate.ano);
      }
      
      if (!bodyToValidate.color && bodyToValidate.cor) {
        console.log('Mapeando cor para color no validateRequest');
        bodyToValidate.color = bodyToValidate.cor;
      }
      
      if (!bodyToValidate.companyId && bodyToValidate.empresaId) {
        console.log('Mapeando empresaId para companyId no validateRequest');
        bodyToValidate.companyId = bodyToValidate.empresaId;
      }
      
      if (!bodyToValidate.driverId && bodyToValidate.motoristaPrincipalId) {
        console.log('Mapeando motoristaPrincipalId para driverId no validateRequest');
        bodyToValidate.driverId = bodyToValidate.motoristaPrincipalId === 'none' ? null : bodyToValidate.motoristaPrincipalId;
      }
      
      if (bodyToValidate.status && typeof bodyToValidate.isActive === 'undefined') {
        console.log('Mapeando status para isActive no validateRequest');
        bodyToValidate.isActive = bodyToValidate.status === 'ativo' || bodyToValidate.status === true;
      }
      
      // Log após possíveis correções
      console.log('Body após correções no validateRequest:', JSON.stringify(bodyToValidate, null, 2));
      
      // Verificar se o schema tem uma propriedade 'body' (formato comum em schemas Zod)
      if ('body' in schema.shape) {
        // Se o schema espera um objeto com propriedade 'body', passar como {body: bodyToValidate}
        await schema.parseAsync({
          body: bodyToValidate,
          query: req.query,
          params: req.params
        });
        console.log('Dados validados com schema Zod (formato objeto com body)');
      } else {
        // Caso contrário, validar diretamente com o schema
        const parsedBody = await schema.parseAsync(bodyToValidate);
        console.log('Dados validados com schema Zod (formato direto):', JSON.stringify(parsedBody, null, 2));
        // Atualiza o req.body com os dados validados/transformados pelo Zod
        req.body = parsedBody;
      }
      
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Erro de validação Zod:', error.errors);
        return res.status(400).json({
          status: 'error',
          message: 'Dados de entrada inválidos',
          errors: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
            code: e.code,
            path: e.path
          })),
        });
      }
      console.error('Erro geral no validateRequest:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Erro interno ao validar dados',
      });
    }
  };
}; 