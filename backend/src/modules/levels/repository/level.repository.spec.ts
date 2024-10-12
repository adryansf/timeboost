import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/database/prisma.service';
import { LevelRepository } from './level.repository';

describe('LevelRepository', () => {
  let repository: LevelRepository;
  let prismaService: PrismaService;

  const mockPrismaService = {
    level: {
      create: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Level 1',
        pointsRequired: 100,
      }),
      findMany: jest.fn().mockResolvedValue([
        { id: 1, name: 'Level 1', pointsRequired: 100 },
        { id: 2, name: 'Level 2', pointsRequired: 200 },
      ]),
      findUnique: jest.fn().mockImplementation((params) => {
        const { id } = params.where;
        if (id === 1) {
          return Promise.resolve({
            id: 1,
            name: 'Level 1',
            pointsRequired: 100,
          });
        }
        return Promise.resolve(null);
      }),
      update: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Updated Level',
        pointsRequired: 150,
      }),
      delete: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Deleted Level',
        pointsRequired: 0,
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LevelRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<LevelRepository>(LevelRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    // Assert
    expect(repository).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  it('should create a level', async () => {
    // Arrange
    const data = { name: 'Level 1', pointsRequired: 100 };

    // Act
    const result = await repository.create(data);

    // Assert
    expect(result).toEqual({
      id: expect.any(Number),
      name: 'Level 1',
      pointsRequired: 100,
    });
    expect(prismaService.level.create).toHaveBeenCalledWith({ data });
  });

  it('should return an array of levels', async () => {
    // Act
    const result = await repository.findAll();

    // Assert
    expect(result).toEqual([
      { id: 1, name: 'Level 1', pointsRequired: 100 },
      { id: 2, name: 'Level 2', pointsRequired: 200 },
    ]);
    expect(prismaService.level.findMany).toHaveBeenCalled();
  });

  it('should find a level by id', async () => {
    // Act
    const result = await repository.findById(1);

    // Assert
    expect(result).toEqual({ id: 1, name: 'Level 1', pointsRequired: 100 });
    expect(prismaService.level.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should return null if level is not found', async () => {
    // Act
    const result = await repository.findById(3);

    // Assert
    expect(result).toBeNull();
    expect(prismaService.level.findUnique).toHaveBeenCalledWith({
      where: { id: 3 },
    });
  });

  it('should update a level', async () => {
    // Arrange
    const updateData = { name: 'Updated Level', pointsRequired: 150 };

    // Act
    const result = await repository.update(1, updateData);

    // Assert
    expect(result).toEqual({
      id: 1,
      name: 'Updated Level',
      pointsRequired: 150,
    });
    expect(prismaService.level.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateData,
    });
  });

  it('should delete a level', async () => {
    // Act
    const result = await repository.delete(1);

    // Assert
    expect(result).toEqual({
      id: 1,
      name: 'Deleted Level',
      pointsRequired: 0,
    });
    expect(prismaService.level.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
