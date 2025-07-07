import { Response } from 'express';
import { ResponseHandler } from '../../../../common/utils/responseHandler';

describe('ResponseHandler', () => {
  let mockRes: Partial<Response>;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockStatus = jest.fn();
    mockJson = jest.fn();
    mockSend = jest.fn();
    
    mockRes = {
      status: mockStatus.mockReturnThis(),
      json: mockJson.mockReturnThis(),
      send: mockSend.mockReturnThis(),
    };
  });

  describe('success', () => {
    it('should send success response with default status code', () => {
      const data = { id: 1, name: 'Test' };
      
      ResponseHandler.success(mockRes as Response, data);
      
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        status: 'success',
        data,
        timestamp: expect.any(String),
      });
    });

    it('should send success response with custom status code', () => {
      const data = { message: 'Updated' };
      
      ResponseHandler.success(mockRes as Response, data, 202);
      
      expect(mockStatus).toHaveBeenCalledWith(202);
      expect(mockJson).toHaveBeenCalledWith({
        status: 'success',
        data,
        timestamp: expect.any(String),
      });
    });

    it('should include meta data when provided', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const meta = { page: 1, limit: 10, total: 2 };
      
      ResponseHandler.success(mockRes as Response, data, 200, meta);
      
      expect(mockJson).toHaveBeenCalledWith({
        status: 'success',
        data,
        meta,
        timestamp: expect.any(String),
      });
    });
  });

  describe('created', () => {
    it('should send created response with 201 status', () => {
      const data = { id: 1, name: 'New Item' };
      
      ResponseHandler.created(mockRes as Response, data);
      
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        status: 'success',
        data,
        timestamp: expect.any(String),
      });
    });
  });

  describe('noContent', () => {
    it('should send no content response with 204 status', () => {
      ResponseHandler.noContent(mockRes as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockSend).toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });
  });

  describe('paginated', () => {
    it('should send paginated response with meta data', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const page = 2;
      const limit = 10;
      const total = 23;
      
      ResponseHandler.paginated(mockRes as Response, data, page, limit, total);
      
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        status: 'success',
        data,
        meta: {
          page: 2,
          limit: 10,
          total: 23,
          totalPages: 3,
        },
        timestamp: expect.any(String),
      });
    });

    it('should calculate correct total pages', () => {
      const data: any[] = [];
      
      ResponseHandler.paginated(mockRes as Response, data, 1, 5, 12);
      
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            totalPages: 3, // Math.ceil(12 / 5)
          }),
        }),
      );
    });
  });
});