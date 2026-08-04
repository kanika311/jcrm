-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'INSTRUCTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PaymentState" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Users" (
    "user_id" UUID NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Courses" (
    "course_id" UUID NOT NULL,
    "faculty_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "status" "CourseStatus" NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "Lessons" (
    "lesson_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "video_key" VARCHAR(255) NOT NULL,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "Lessons_pkey" PRIMARY KEY ("lesson_id")
);

-- CreateTable
CREATE TABLE "Enrollments" (
    "enrollment_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "transaction_id" VARCHAR(255),
    "payment_status" "PaymentState" NOT NULL,
    "progress_percent" INTEGER NOT NULL DEFAULT 0,
    "enrolled_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollments_pkey" PRIMARY KEY ("enrollment_id")
);

-- CreateTable
CREATE TABLE "Testimonials" (
    "testimonial_id" UUID NOT NULL,
    "student_name" VARCHAR(255) NOT NULL,
    "review_text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Testimonials_pkey" PRIMARY KEY ("testimonial_id")
);

-- CreateTable
CREATE TABLE "Platform_Settings" (
    "id" SERIAL NOT NULL,
    "theme_config" JSONB NOT NULL,
    "global_content" JSONB NOT NULL,
    "footer_links" JSONB NOT NULL,
    "last_updated_by" UUID NOT NULL,

    CONSTRAINT "Platform_Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollments_transaction_id_key" ON "Enrollments"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollments_student_id_course_id_key" ON "Enrollments"("student_id", "course_id");

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lessons" ADD CONSTRAINT "Lessons_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Platform_Settings" ADD CONSTRAINT "Platform_Settings_last_updated_by_fkey" FOREIGN KEY ("last_updated_by") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
