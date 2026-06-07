import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "@/lib/trpc";
import { db, schema } from "@endow/db";
import { eq, desc, and, like, or, count, sql } from "drizzle-orm";

export const adminRouter = createTRPCRouter({
  dashboard: createTRPCRouter({
    getMetrics: adminProcedure.query(async () => {
      const studentCountRes = await db
        .select({ value: count() })
        .from(schema.users)
        .where(eq(schema.users.role, "STUDENT"));
      const counselorCountRes = await db
        .select({ value: count() })
        .from(schema.users)
        .where(eq(schema.users.role, "COUNSELOR"));

      const appsByStatus = await db
        .select({
          status: schema.applications.status,
          count: count(),
        })
        .from(schema.applications)
        .groupBy(schema.applications.status);

      const recentActivity = await db.query.applications.findMany({
        orderBy: [desc(schema.applications.updatedAt)],
        limit: 10,
        with: {
          student: {
            with: { user: true },
          },
          course: {
            with: { university: true },
          },
        },
      });

      return {
        students: studentCountRes[0]?.value || 0,
        counselors: counselorCountRes[0]?.value || 0,
        applicationsByStatus: appsByStatus,
        recentActivity,
      };
    }),
  }),

  students: createTRPCRouter({
    list: adminProcedure
      .input(
        z.object({
          search: z.string().optional(),
          cursor: z.string().nullish(),
          limit: z.number().min(1).max(100).default(20),
        })
      )
      .query(async ({ input }) => {
        const { search, cursor, limit } = input;

        const where = and(
          eq(schema.users.role, "STUDENT"),
          search
            ? or(
                like(schema.users.name, `%${search}%`),
                like(schema.users.email, `%${search}%`)
              )
            : undefined,
          cursor ? sql`${schema.users.id} < ${cursor}` : undefined // Simple cursor logic based on desc ID
        );

        const items = await db.query.users.findMany({
          where,
          limit: limit + 1,
          orderBy: [desc(schema.users.id)],
          with: {
            studentProfile: {
              with: { assignedCounselor: { with: { user: true } } },
            },
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (items.length > limit) {
          const nextItem = items.pop();
          nextCursor = nextItem!.id;
        }

        return { items, nextCursor };
      }),

    getById: adminProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const student = await db.query.users.findFirst({
          where: and(eq(schema.users.id, input.id), eq(schema.users.role, "STUDENT")),
          with: {
            studentProfile: {
              with: {
                assignedCounselor: true,
                applications: {
                  with: {
                    course: { with: { university: true } },
                  },
                },
                bookingSessions: {
                  with: { counselor: true },
                },
              },
            },
          },
        });
        return student;
      }),

    updateProfile: adminProcedure
      .input(
        z.object({
          id: z.string(),
          data: z.any(), // Add proper schema if needed
        })
      )
      .mutation(async ({ input }) => {
        // Find profile ID
        const profile = await db.query.studentProfiles.findFirst({
          where: eq(schema.studentProfiles.userId, input.id),
        });
        if (profile) {
          await db
            .update(schema.studentProfiles)
            .set(input.data)
            .where(eq(schema.studentProfiles.id, profile.id));
        }
        return { success: true };
      }),

    assignCounselor: adminProcedure
      .input(
        z.object({
          studentId: z.string(),
          counselorId: z.string().nullable(),
        })
      )
      .mutation(async ({ input }) => {
        await db
          .update(schema.studentProfiles)
          .set({ assignedCounselorId: input.counselorId })
          .where(eq(schema.studentProfiles.userId, input.studentId));
        return { success: true };
      }),
  }),

  applications: createTRPCRouter({
    list: adminProcedure
      .input(
        z.object({
          search: z.string().optional(),
          status: z.enum(['DRAFT', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_REQUIRED', 'ACCEPTED', 'REJECTED', 'WAITLISTED', 'WITHDRAWN']).optional(),
          cursor: z.string().nullish(),
          limit: z.number().min(1).max(100).default(20),
        })
      )
      .query(async ({ input }) => {
        const { search, status, cursor, limit } = input;

        // Note: For complex search across relations, you might need joins.
        // Here we keep it simple or filter memory side for deep relation search.
        const items = await db.query.applications.findMany({
          where: and(
            status ? eq(schema.applications.status, status) : undefined,
            cursor ? sql`${schema.applications.id} < ${cursor}` : undefined
          ),
          limit: limit + 1,
          orderBy: [desc(schema.applications.id)],
          with: {
            student: { with: { user: true } },
            course: { with: { university: true } },
            counselor: { with: { user: true } },
          },
        });

        // Client-side search filtering for simplicity if relation search is complex in Drizzle queries
        let filteredItems = items;
        if (search) {
          const lowerSearch = search.toLowerCase();
          filteredItems = items.filter(
            (app) =>
              app.student?.user?.name?.toLowerCase().includes(lowerSearch) ||
              app.course?.university?.name.toLowerCase().includes(lowerSearch) ||
              app.course?.name.toLowerCase().includes(lowerSearch)
          );
        }

        let nextCursor: typeof cursor | undefined = undefined;
        if (items.length > limit) {
          const nextItem = items.pop();
          nextCursor = nextItem!.id;
        }

        return { items: filteredItems.slice(0, limit), nextCursor };
      }),

    getById: adminProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return db.query.applications.findFirst({
          where: eq(schema.applications.id, input.id),
          with: {
            student: { with: { user: true } },
            course: { with: { university: true } },
            counselor: { with: { user: true } },
          },
        });
      }),

    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.string(),
          status: z.enum(['DRAFT', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_REQUIRED', 'ACCEPTED', 'REJECTED', 'WAITLISTED', 'WITHDRAWN']),
        })
      )
      .mutation(async ({ input }) => {
        await db
          .update(schema.applications)
          .set({ status: input.status })
          .where(eq(schema.applications.id, input.id));
        return { success: true };
      }),

    addNotes: adminProcedure
      .input(
        z.object({
          id: z.string(),
          notes: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        await db
          .update(schema.applications)
          .set({ counselorNotes: input.notes })
          .where(eq(schema.applications.id, input.id));
        return { success: true };
      }),
  }),

  counselors: createTRPCRouter({
    list: adminProcedure.query(async () => {
      return db.query.users.findMany({
        where: eq(schema.users.role, "COUNSELOR"),
        with: {
          counselorProfile: true,
        },
      });
    }),
    getById: adminProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return db.query.users.findFirst({
          where: and(eq(schema.users.id, input.id), eq(schema.users.role, "COUNSELOR")),
          with: { counselorProfile: true },
        });
      }),
  }),

  notifications: createTRPCRouter({
    sendSystem: adminProcedure
      .input(
        z.object({
          userId: z.string().optional(), // If not provided, it's a broadcast
          title: z.string(),
          body: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        if (input.userId) {
          await db.insert(schema.notifications).values({
            userId: input.userId,
            title: input.title,
            body: input.body,
            type: "SYSTEM",
          });
        } else {
          // Broadcast to all (expensive in real app, might want a batch process)
          const allUsers = await db.select({ id: schema.users.id }).from(schema.users);
          const values = allUsers.map((u) => ({
            userId: u.id,
            title: input.title,
            body: input.body,
            type: "SYSTEM" as const,
          }));
          // Chunked insert if many
          for (let i = 0; i < values.length; i += 1000) {
             await db.insert(schema.notifications).values(values.slice(i, i + 1000));
          }
        }
        return { success: true };
      }),
  }),
});
