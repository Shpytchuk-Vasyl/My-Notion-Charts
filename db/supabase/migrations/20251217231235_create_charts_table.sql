-- Create chart type enum
CREATE TYPE public.chart_type AS ENUM ('bar', 'line', 'pie', 'scatter', 'radar', 'area', 'radial');

-- Create charts table
CREATE TABLE IF NOT EXISTS public.charts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    type public.chart_type NOT NULL,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    databases UUID[] NOT NULL DEFAULT '{}'::uuid[],
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries by workspace_id
CREATE INDEX IF NOT EXISTS idx_charts_workspace_id ON public.charts(workspace_id);

-- Enable Row Level Security
ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only view their own charts
CREATE POLICY "Users can view their own charts"
    ON public.charts
    FOR SELECT
    USING (
        workspace_id IN (
            SELECT id FROM public.workspaces WHERE user_id = (select auth.uid())
        )
    );

-- Create policy: Users can insert charts for their workspaces
CREATE POLICY "Users can insert charts for their workspaces"
    ON public.charts
    FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT id FROM public.workspaces WHERE user_id = (select auth.uid())
        )
    );

-- Create policy: Users can update their own charts
CREATE POLICY "Users can update their own charts"
    ON public.charts
    FOR UPDATE
    USING (
        workspace_id IN (
            SELECT id FROM public.workspaces WHERE user_id = (select auth.uid())
        )
    )
    WITH CHECK (
        workspace_id IN (
            SELECT id FROM public.workspaces WHERE user_id = (select auth.uid())
        )
    );

-- Create policy: Users can delete their own charts
CREATE POLICY "Users can delete their own charts"
    ON public.charts
    FOR DELETE
    USING (
        workspace_id IN (
            SELECT id FROM public.workspaces WHERE user_id = (select auth.uid())
        )
    );


CREATE TRIGGER set_updated_at_charts
    BEFORE UPDATE ON public.charts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();