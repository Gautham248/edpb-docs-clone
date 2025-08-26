-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  publication_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create article_tags junction table
CREATE TABLE public.article_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  UNIQUE(article_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required as specified)
CREATE POLICY "Articles are publicly readable" 
ON public.articles 
FOR SELECT 
USING (true);

CREATE POLICY "Articles are publicly writable" 
ON public.articles 
FOR ALL 
USING (true);

CREATE POLICY "Tags are publicly readable" 
ON public.tags 
FOR SELECT 
USING (true);

CREATE POLICY "Tags are publicly writable" 
ON public.tags 
FOR ALL 
USING (true);

CREATE POLICY "Article tags are publicly readable" 
ON public.article_tags 
FOR SELECT 
USING (true);

CREATE POLICY "Article tags are publicly writable" 
ON public.article_tags 
FOR ALL 
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_articles_publication_date ON public.articles(publication_date DESC);
CREATE INDEX idx_articles_title ON public.articles USING gin(to_tsvector('english', title));
CREATE INDEX idx_articles_content ON public.articles USING gin(to_tsvector('english', content));
CREATE INDEX idx_tags_name ON public.tags(name);
CREATE INDEX idx_article_tags_article_id ON public.article_tags(article_id);
CREATE INDEX idx_article_tags_tag_id ON public.article_tags(tag_id);

-- Insert sample data
INSERT INTO public.tags (name) VALUES 
('Financial matters'),
('Statements'),
('Opinion of the Board (Art. 64)'),
('Certification'),
('Austria'),
('Other'),
('International Transfers of Data'),
('Binding Corporate Rules'),
('New Technology'),
('Cooperation between authorities'),
('Data Protection Impact Assessment (DPIA)'),
('Code of conduct'),
('Accreditation'),
('EU Legislative proposal and strategy'),
('Adequacy decision');

-- Insert sample articles
WITH tag_ids AS (
  SELECT id, name FROM public.tags
)
INSERT INTO public.articles (title, content, publication_date) VALUES 
('EDPB contribution to the EBA public consultation on draft regulatory technical standards on AML/CFT', 
'<p>The European Data Protection Board (EDPB) provides its contribution to the European Banking Authority (EBA) public consultation on draft regulatory technical standards on anti-money laundering and countering the financing of terrorism (AML/CFT).</p><p>This contribution addresses the data protection implications of the proposed regulatory framework and ensures compliance with the General Data Protection Regulation (GDPR).</p>', 
'2025-07-22'),
('Statement 4/2025 on the European Commission''s Recommendation on draft non-binding model contractual terms on data sharing under the Data Act', 
'<p>The EDPB adopts Statement 4/2025 regarding the European Commission''s Recommendation on draft non-binding model contractual terms for data sharing under the Data Act.</p><p>This statement provides guidance on ensuring data protection compliance when implementing data sharing agreements under the new regulatory framework.</p>', 
'2025-07-14'),
('Opinion 15/2025 on the draft decision of the Austrian Supervisory Authority (AT SA) regarding the certification criteria of BDO Consulting GmbH', 
'<p>The EDPB issues Opinion 15/2025 concerning the draft decision of the Austrian Data Protection Authority regarding certification criteria for BDO Consulting GmbH.</p><p>This opinion evaluates the proposed certification framework and its alignment with GDPR requirements for data protection certification mechanisms.</p>', 
'2025-07-14');

-- Link articles with tags
INSERT INTO public.article_tags (article_id, tag_id)
SELECT a.id, t.id 
FROM public.articles a, public.tags t 
WHERE (a.title LIKE '%EBA%' AND t.name IN ('Financial matters', 'Other'))
   OR (a.title LIKE '%Statement%' AND t.name = 'Statements')
   OR (a.title LIKE '%Opinion%' AND t.name IN ('Opinion of the Board (Art. 64)', 'Certification', 'Austria'));