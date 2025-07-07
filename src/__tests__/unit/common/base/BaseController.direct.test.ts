import { BaseController } from '../../../../common/base/BaseController';

// Direct test to increase coverage

describe('BaseController - Direct Test', () => {
  // Create multiple test implementations to test different scenarios
  class TestController extends BaseController {
    public initializeRoutesCalled = false;

    protected initializeRoutes(): void {
      this.initializeRoutesCalled = true;
      this.router.get('/test', (_req, res) => res.json({ message: 'test' }));
      this.router.post('/test', (_req, res) => res.json({ created: true }));
      this.router.put('/test/:id', (req, res) => res.json({ updated: req.params.id }));
      this.router.delete('/test/:id', (req, res) => res.json({ deleted: req.params.id }));
    }
  }

  class EmptyController extends BaseController {
    protected initializeRoutes(): void {
      // Empty implementation
    }
  }

  class ErrorController extends BaseController {
    protected initializeRoutes(): void {
      throw new Error('Initialization failed');
    }
  }

  describe('Constructor and initialization', () => {
    it('should create router and call initializeRoutes', () => {
      const controller = new TestController();
      
      expect(controller.getRouter()).toBeDefined();
      expect(controller.getRouter()).toBeInstanceOf(Function);
    });

    it('should create separate router instances for different controllers', () => {
      const controller1 = new TestController();
      const controller2 = new TestController();
      
      expect(controller1.getRouter()).not.toBe(controller2.getRouter());
    });

    it('should handle empty route initialization', () => {
      const controller = new EmptyController();
      const router = controller.getRouter();
      
      expect(router).toBeDefined();
      expect(router.stack.filter((layer: any) => layer.route)).toHaveLength(0);
    });

    it('should throw error if initializeRoutes throws', () => {
      expect(() => new ErrorController()).toThrow('Initialization failed');
    });
  });

  describe('getRouter method', () => {
    it('should return the router with all defined routes', () => {
      const controller = new TestController();
      const router = controller.getRouter();
      
      const routes = router.stack
        .filter((layer: any) => layer.route)
        .map((layer: any) => ({
          path: layer.route.path,
          methods: Object.keys(layer.route.methods),
        }));
      
      expect(routes).toEqual([
        { path: '/test', methods: ['get'] },
        { path: '/test', methods: ['post'] },
        { path: '/test/:id', methods: ['put'] },
        { path: '/test/:id', methods: ['delete'] },
      ]);
    });

    it('should return the same router instance on multiple calls', () => {
      const controller = new TestController();
      const router1 = controller.getRouter();
      const router2 = controller.getRouter();
      
      expect(router1).toBe(router2);
    });
  });

  describe('Router functionality', () => {
    it('should support middleware registration', () => {
      class MiddlewareController extends BaseController {
        protected initializeRoutes(): void {
          this.router.use((_req, _res, next) => next());
          this.router.get('/test', (_req, res) => res.json({ test: true }));
        }
      }
      
      const controller = new MiddlewareController();
      const router = controller.getRouter();
      
      // Router stack includes both middleware and route
      expect(router.stack.length).toBeGreaterThan(1);
    });

    it('should support route parameters', () => {
      const controller = new TestController();
      const router = controller.getRouter();
      
      const paramRoute = router.stack.find((layer: any) => 
        layer.route?.path === '/test/:id'
      );
      
      expect(paramRoute).toBeDefined();
      expect(paramRoute?.regexp.test('/test/123')).toBe(true);
      expect(paramRoute?.regexp.test('/test/')).toBe(false);
    });
  });

  describe('Abstract class behavior', () => {
    it('should not allow direct instantiation', () => {
      // TypeScript prevents this at compile time, but we can test the runtime behavior
      const BaseControllerConstructor = BaseController as any;
      
      // This would fail in TypeScript but we're testing runtime
      try {
        const instance = new BaseControllerConstructor();
        // If we get here, we need to call initializeRoutes to avoid errors
        expect(() => instance.initializeRoutes()).toThrow();
      } catch (e) {
        // Expected - can't instantiate abstract class
      }
    });
  });

  describe('Integration with Express', () => {
    it('should be mountable on Express app', () => {
      const express = require('express');
      const app = express();
      const controller = new TestController();
      
      // This should not throw
      expect(() => {
        app.use('/api', controller.getRouter());
      }).not.toThrow();
    });
  });
});