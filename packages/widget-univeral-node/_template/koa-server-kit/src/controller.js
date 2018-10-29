import koaRouter from 'koa-router';
const router = new koaRouter();



// 首页
async function homeRouter(ctx) {
  return ctx.body = 'resonse 200';
}


router.get('/', homeRouter);

export default router;
