import controller from './controller.js';

export default function middlewreRegister(app) {
    // router dispatcher
    app.use(controller.routes());
}
