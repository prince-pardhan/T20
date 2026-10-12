"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Group,
  Text,
  Title,
  Badge,
  Image,
  Stack,
  SimpleGrid,
  Card,
  Anchor,
  Divider,
  TextInput,
  ActionIcon,
  Loader,
  Center,
  Alert,
  Grid,
  Button,
  ThemeIcon,
  UnstyledButton,
  ScrollArea,
  Paper,
} from "@mantine/core";
import {
  IconSearch,
  IconBell,
  IconUser,
  IconMenu2,
  IconHome,
  IconFlame,
  IconSun,
  IconCloud,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconEye,
} from "@tabler/icons-react";
import { createClient } from "@base44/sdk";

// ─── Multiple Base44 App Configs ────────────────────────────────────────────
const BASE44_SOURCES = [
  { appId: "6ac73942c980e55d9137380b", entity: "News", label: "Source 1" },
  { appId: "6ac47ab69017eaaaca59d2b6", entity: "NewsArticle", label: "Source 2" },
  { appId: "6ac74166b60dfff87e4daa42", entity: "News", label: "Source 3" },
  { appId: "6ac739626c09d4a58a836242", entity: "News", label: "Source 4" },
  { appId: "6ac886b5654b5b3de6285403", entity: "News", label: "Source 5" },
  { appId: "6ac8879bc192246ca1e81374", entity: "News", label: "Source 6" },
  { appId: "6ac88f5d592444cfa59f9489", entity: "News", label: "Source 7" },
  { appId: "6ac9d498df194de5527bec19", entity: "News", label: "Source 8" },
  { appId: "6aa8e8cfd6878fb3c6c66a6d", entity: "News", label: "Source 9" },
  { appId: "6ac9d305c9956c412b63d620", entity: "Article", label: "Source 10" },
  { appId: "6ab4c278a87c64b26180c135", entity: "News", label: "Source 11" },
  { appId: "6a9fc3ec7fb02e0fe4f0af78", entity: "News", label: "Source 12" },
  { appId: "6ab4c3844cd0d31fd45fd867", entity: "News", label: "Source 13" },
  { appId: "6aa8edc0e27445204a122451", entity: "News", label: "Source 14" },
];

const PERSONAL_ACCESS_TOKEN = "YOUR_PERSONAL_ACCESS_TOKEN"; // ← apna token yahan daalo

// Colors matching the mockup
const ACCENT = "#e30613";
const DARK_NAV = "#0f172a";
const LIGHT_BG = "#f8fafc";
const FONT = "'Inter', system-ui, -apple-system, sans-serif";

const CATEGORIES = [
  { key: "all", label: "All News", icon: "▦" },
  { key: "india", label: "India", icon: "🇮🇳" },
  { key: "world", label: "World", icon: "🌐" },
  { key: "politics", label: "Politics", icon: "🏛" },
  { key: "business", label: "Business", icon: "📈" },
  { key: "technology", label: "Technology", icon: "💻" },
  { key: "sports", label: "Sports", icon: "⚽" },
  { key: "entertainment", label: "Entertainment", icon: "🎬" },
  { key: "education", label: "Education", icon: "🎓" },
  { key: "health", label: "Health", icon: "❤️" },
];

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchAllNews() {
      try {
        setLoading(true);
        setError(null);

        const allResults: any[] = [];

        const promises = BASE44_SOURCES.map(async (source) => {
          try {
            const base44 = createClient({
              appId: source.appId,
              headers: {
                Authorization: `Bearer ${PERSONAL_ACCESS_TOKEN}`,
              },
            });

            const records = await base44.entities[source.entity].list();

            if (Array.isArray(records)) {
              return records.map((r: any) => ({
                ...r,
                _source: source.label,
                _entity: source.entity,
                _appId: source.appId,
              }));
            }
            return [];
          } catch (srcErr: any) {
            console.warn(`Failed to fetch from ${source.label}:`, srcErr?.message);
            return [];
          }
        });

        const results = await Promise.all(promises);
        results.forEach((arr) => allResults.push(...arr));

        // Sort newest first
        allResults.sort((a, b) => {
          const dateA = new Date(
            a.created_date || a.createdAt || a.published_at || a.date || 0
          ).getTime();
          const dateB = new Date(
            b.created_date || b.createdAt || b.published_at || b.date || 0
          ).getTime();
          return dateB - dateA;
        });

        setNews(allResults);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to load news");
      } finally {
        setLoading(false);
      }
    }

    fetchAllNews();
  }, []);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const getImage = (item: any) =>
    item.image ||
    item.image_url ||
    item.cover_image ||
    item.thumbnail ||
    "https://images.unsplash.com/photo-1504711434869-e1ff66873b80?w=800&h=500&fit=crop";

  const getTitle = (item: any) =>
    item.title || item.name || item.headline || "Untitled";

  const getDesc = (item: any) =>
    item.description ||
    item.content ||
    item.summary ||
    item.body ||
    "No description available.";

  const getDate = (item: any) => {
    const d =
      item.created_date ||
      item.createdAt ||
      item.published_at ||
      item.date ||
      Date.now();
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getFullDate = (item: any) => {
    const d =
      item.created_date ||
      item.createdAt ||
      item.published_at ||
      item.date ||
      Date.now();
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTimeAgo = (item: any) => {
    const d = new Date(
      item.created_date || item.createdAt || item.published_at || item.date || Date.now()
    );
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const getBadge = (item: any) =>
    (item.category || item.badge || item.tag || item.type || "News").toString().toUpperCase();

  const getCategoryKey = (item: any) => {
    const cat = (item.category || item.badge || item.tag || "").toString().toLowerCase();
    if (cat.includes("politic")) return "politics";
    if (cat.includes("world") || cat.includes("international")) return "world";
    if (cat.includes("business") || cat.includes("economy") || cat.includes("sensex")) return "business";
    if (cat.includes("tech") || cat.includes("6g") || cat.includes("ai")) return "technology";
    if (cat.includes("sport") || cat.includes("cricket")) return "sports";
    if (cat.includes("entertain") || cat.includes("bollywood")) return "entertainment";
    if (cat.includes("education")) return "education";
    if (cat.includes("health")) return "health";
    return "india";
  };

  // Filter news
  const filteredNews = news.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || getCategoryKey(item) === activeCategory;
    const matchesSearch =
      !searchQuery ||
      getTitle(item).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getDesc(item).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = filteredNews[0];
  const sideNews = filteredNews.slice(1, 5);
  const topNews = filteredNews.slice(0, 5);
  const indiaNews = filteredNews.filter((n) => getCategoryKey(n) === "india").slice(0, 1);
  const worldNews = filteredNews.filter((n) => getCategoryKey(n) === "world").slice(0, 1);
  const businessNews = filteredNews.filter((n) => getCategoryKey(n) === "business").slice(0, 1);
  const sportsNews = filteredNews.filter((n) => getCategoryKey(n) === "sports").slice(0, 1);

  // ─── LOADING ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Center h="100vh" bg={LIGHT_BG}>
        <Stack align="center" gap="md">
          <Loader size="xl" color={ACCENT} />
          <Text size="sm" c="dimmed" fw={500}>
            Saari sources se news load ho rahi hai...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="sm" py={80}>
        <Alert color="red" title="Error" radius="md">
          {error}
        </Alert>
      </Container>
    );
  }

  // ─── DETAIL VIEW ──────────────────────────────────────────────────────────
  if (selectedNews) {
    const item = selectedNews;
    return (
      <Box bg={LIGHT_BG} style={{ minHeight: "100vh", fontFamily: FONT }}>
        {/* Sticky Header */}
        <Box
          bg="white"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            borderBottom: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Container size="lg" py="sm">
            <Group justify="space-between">
              <Group gap="xs">
                <Box
                  style={{
                    width: 32,
                    height: 32,
                    background: ACCENT,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                 
                </Box>
                <Text fw={800} size="lg" style={{ color: ACCENT }}>
                  LiveUpdate
                </Text>
              </Group>
              <Button
                variant="light"
                color="gray"
                radius="md"
                size="sm"
                leftSection={<IconChevronLeft size={16} />}
                onClick={() => setSelectedNews(null)}
              >
                Back to Home
              </Button>
            </Group>
          </Container>
        </Box>

        <Container size="md" py={{ base: 30, md: 50 }}>
          <Group gap="sm" mb="md">
            <Badge color="red" size="lg" radius="sm" variant="filled">
              {getBadge(item)}
            </Badge>
            {item._source && (
              <Badge color="dark" size="sm" variant="outline">
                {item._source}
              </Badge>
            )}
            <Text size="sm" c="dimmed" fw={500}>
              {getFullDate(item)}
            </Text>
          </Group>

          <Title
            order={1}
            mb="xl"
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
              fontWeight: 800,
              lineHeight: 1.25,
              color: "#0f172a",
            }}
          >
            {getTitle(item)}
          </Title>

          <Box
            mb="xl"
            style={{
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
            }}
          >
            <Image src={getImage(item)} alt={getTitle(item)} h={{ base: 240, sm: 380, md: 460 }} fit="cover" />
          </Box>

          <Paper p={{ base: "lg", sm: "xl" }} radius="md" withBorder bg="white">
            <Text
              style={{
                fontSize: 17,
                lineHeight: 1.85,
                color: "#334155",
                whiteSpace: "pre-line",
              }}
            >
              {getDesc(item)}
            </Text>

            <Divider my="xl" color="#e2e8f0" />

            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed">
                  Published on
                </Text>
                <Text size="sm" fw={600}>
                  {getFullDate(item)}
                </Text>
              </Box>
              <Button
                variant="filled"
                color="red"
                radius="md"
                onClick={() => setSelectedNews(null)}
              >
                ← Back to All News
              </Button>
            </Group>
          </Paper>

          {/* More News */}
          {news.length > 1 && (
            <Box mt={50}>
              <Title order={3} mb="lg" fw={700} c={"black"}>
                More News
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {news
                  .filter((n) => n.id !== item.id)
                  .slice(0, 4)
                  .map((n) => (
                    <Card
                      key={n.id || Math.random()}
                      padding="sm"
                      radius="md"
                      withBorder
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedNews(n)}
                    >
                      <Group wrap="nowrap" gap="sm">
                        <Image src={getImage(n)} w={72} h={72} radius={8} fit="cover" />
                        <Box>
                          <Text size="sm" fw={600} lineClamp={2}>
                            {getTitle(n)}
                          </Text>
                          <Text size="xs" c="dimmed" mt={4}>
                            {getDate(n)}
                          </Text>
                        </Box>
                      </Group>
                    </Card>
                  ))}
              </SimpleGrid>
            </Box>
          )}
        </Container>
      </Box>
    );
  }

  // ─── MAIN LIST VIEW (Mockup Design) ───────────────────────────────────────
  return (
    <Box bg={LIGHT_BG} style={{ minHeight: "100vh", fontFamily: FONT }}>
      {/* ═══════ TOP HEADER ═══════ */}
      <Box bg="white" style={{ borderBottom: "1px solid #e2e8f0" }}>
        <Container size="xl" py="sm">
          <Group justify="space-between" align="center" wrap="nowrap">
            {/* Logo */}
            <Group gap={8} style={{ flexShrink: 0 }}>
              
              <Box>
                <Text fw={900} size="xl" style={{ color: ACCENT, letterSpacing: -0.5, lineHeight: 1 }}>
                  LiveUpdate24
                </Text>
                
              </Box>
            </Group>

            {/* Search */}
            <TextInput
              placeholder="Search news, topics, or keywords..."
              leftSection={<IconSearch size={16} color="#94a3b8" />}
              radius="xl"
              size="sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              styles={{
                root: { flex: 1, maxWidth: 480, margin: "0 24px" },
                input: {
                  background: "#f1f5f9",
                  border: "none",
                  fontSize: 14,
                },
              }}
              visibleFrom="sm"
            />

            {/* Right icons */}
            <Group gap="xs" style={{ flexShrink: 0 }}>
              <ActionIcon variant="subtle" color="gray" size="lg" radius="xl">
                <IconSun size={18} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray" size="lg" radius="xl" style={{ position: "relative" }}>
                <IconBell size={18} />
                <Box
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 16,
                    height: 16,
                    background: ACCENT,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  3
                </Box>
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray" size="lg" radius="xl">
                <IconUser size={18} />
              </ActionIcon>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* ═══════ NAVIGATION BAR ═══════ */}
      <Box bg={DARK_NAV} c="white">
        <Container size="xl">
          <Group gap={0} wrap="nowrap" style={{ overflowX: "auto" }}>
            <UnstyledButton
              px="md"
              py={12}
              style={{
                background: activeCategory === "all" ? ACCENT : "transparent",
                borderRadius: "0",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
              onClick={() => setActiveCategory("all")}
            >
              <IconHome size={16} />
              <Text size="sm" fw={600}>
                Home
              </Text>
            </UnstyledButton>

            {["India", "World", "Politics", "Business", "Technology", "Sports", "Entertainment", "Education", "Health"].map(
              (cat) => (
                <UnstyledButton
                  key={cat}
                  px="md"
                  py={12}
                  style={{
                    background:
                      activeCategory === cat.toLowerCase() ? ACCENT : "transparent",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => setActiveCategory(cat.toLowerCase())}
                >
                  <Text size="sm" fw={500}>
                    {cat}
                  </Text>
                </UnstyledButton>
              )
            )}
            <UnstyledButton px="md" py={12}>
              <Text size="sm" fw={500}>
                More ▾
              </Text>
            </UnstyledButton>
          </Group>
        </Container>
      </Box>

      {/* ═══════ BREAKING NEWS BAR ═══════ */}
      <Box bg="#fef2f2" style={{ borderBottom: "1px solid #fecaca" }}>
        <Container size="xl" py={10}>
          <Group justify="space-between" wrap="nowrap">
            <Group gap="md" wrap="nowrap" style={{ overflow: "hidden" }}>
              <Badge
                color="red"
                size="lg"
                radius="sm"
                leftSection={<IconFlame size={14} />}
                style={{ flexShrink: 0 }}
              >
                Breaking News
              </Badge>
              <Text size="sm" fw={600} style={{ color: "#7f1d1d" }} lineClamp={1}>
                {featured
                  ? getTitle(featured)
                  : "Breaking News"}
              </Text>
            </Group>
            <Group gap={4} style={{ flexShrink: 0 }}>
          
              
            </Group>
          </Group>
        </Container>
      </Box>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <Container size="xl" py={{ base: 20, md: 28 }}>
        <Grid>
          {/* LEFT – Featured + Side Stories */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Grid >
              {/* Big Featured */}
              <Grid.Col span={{ base: 12, md: 7 }}>
                {featured && (
                  <Box
                    style={{
                      position: "relative",
                      borderRadius: 12,
                      overflow: "hidden",
                      cursor: "pointer",
                      height: "100%",
                      minHeight: 380,
                      color: "black",
                    }}
                    onClick={() => setSelectedNews(featured)}
                  >
                    <Image
                      src={getImage(featured)}
                      h="100%"
                      fit="cover"
                      style={{ position: "absolute", inset: 0 }}
                    />
                    <Box
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                      }}
                    />
                    <Box
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "20px 24px",
                        color: "white",
                      }}
                    >
                      <Badge color="red" size="sm" mb={8} radius="sm">
                        {getBadge(featured)}
                      </Badge>
                      <Title
                        order={2}
                        style={{
                          fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                          fontWeight: 800,
                          lineHeight: 1.3,
                          color: "white",
                          marginBottom: 8,
                        }}
                      >
                        {getTitle(featured)}
                      </Title>
                      <Text size="sm" c="gray.3" lineClamp={2} mb={10}>
                        {getDesc(featured)}
                      </Text>
                      <Group gap="md">
                        <Text size="xs" c="gray.4">
                          📅 {getDate(featured)}
                        </Text>
                        <Text size="xs" c="gray.4">
                          ⏱ 2 min read
                        </Text>
                      </Group>
                    </Box>
                  </Box>
                )}
              </Grid.Col>

              {/* Side 4 stories */}
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Stack gap="sm" h="100%">
                  {sideNews.map((item, i) => (
                    <Paper
                      key={item.id || i}
                      p="sm"
                      radius="md"
                      withBorder
                      style={{ cursor: "pointer", flex: 1 }}
                      onClick={() => setSelectedNews(item)}
                    >
                      <Group wrap="nowrap" gap="sm" align="flex-start">
                        <Image
                          src={getImage(item)}
                          w={80}
                          h={64}
                          radius={8}
                          fit="cover"
                          style={{ flexShrink: 0 }}
                        />
                        <Box style={{ flex: 1, minWidth: 0 }}>
                          <Text
                            size="xs"
                            fw={900}
                            c={ACCENT}
                            tt="uppercase"
                            mb={2}
                            style={{ letterSpacing: 0.5 }}
                          >
                            {getBadge(item)}
                          </Text>
                          <Text size="sm" fw={600} lineClamp={2} style={{ lineHeight: 1.35 }}c="black">
                            {getTitle(item)}
                          </Text>
                          <Text size="xs" c="dimmed" mt={4}>
                            {getTimeAgo(item)}
                          </Text>
                        </Box>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>
          </Grid.Col>

          {/* RIGHT – Weather + Top News */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="md">
              {/* Weather Card */}
              <Paper p="md" radius="md" withBorder bg="white">
                <Group justify="space-between" mb={4}>
                  <Group gap={6}>
                    <IconCloud size={22} color="#3b82f6" />
                    <Text fw={700} size="sm" c="black">
                      New Delhi
                    </Text>
                  </Group>
                 
                </Group>
                <Group align="flex-end" gap={4}>
                  <Text fw={800} style={{ fontSize: 32, lineHeight: 1 }}c="black">
                    28°C
                  </Text>
                  <Text size="xs" c="black" mb={4}>
                    H: 32° · L: 20°
                  </Text>
                </Group>
              </Paper>

              {/* Top News */}
              <Paper p="md" radius="md" withBorder bg="white">
                <Group gap={6} mb="md">
                  <IconFlame size={18} color={ACCENT} />
                  <Text fw={800} size="sm" c="black">
                    Top News
                  </Text>
                </Group>
                <Stack gap="sm" c="black">
                  {topNews.map((item, i) => (
                    <Box
                      key={item.id || i}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedNews(item)}
                    >
                      <Group wrap="nowrap" gap="sm" align="flex-start">
                        <Text
                          fw={800}
                          size="lg"
                          c="black" style={{ lineHeight: 1, minWidth: 20 }}
                        >
                          {i + 1}
                        </Text>
                        <Text size="sm" fw={500} lineClamp={2} style={{ lineHeight: 1.4 }} c="black">
                          {getTitle(item)}
                        </Text>
                      </Group>
                      {i < topNews.length - 1 && <Divider mt="sm" color="#f1f5f9" />}
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* ═══════ CATEGORY ICONS ═══════ */}
        <ScrollArea mt={28} mb={8} type="never">
          <Group gap="sm" wrap="nowrap" pb={4}>
            {CATEGORIES.map((cat) => (
              <UnstyledButton
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: activeCategory === cat.key ? ACCENT : "white",
                  border: `1px solid ${activeCategory === cat.key ? ACCENT : "#e2e8f0"}`,
                  minWidth: 80,
                  transition: "all 0.15s",
                }}
              >
                <Text size="lg">{cat.icon}</Text>
                <Text
                  size="xs"
                  fw={600}
                  c={activeCategory === cat.key ? "white" : "dark"}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {cat.label}
                </Text>
              </UnstyledButton>
            ))}
          </Group>
        </ScrollArea>

        {/* ═══════ SECTION CARDS (India / World / Business / Sports) ═══════ */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mt={24}>
          {[
            { title: "India", items: indiaNews, color: "#16a34a" },
            { title: "World", items: worldNews, color: "#2563eb" },
            { title: "Business", items: businessNews, color: "#d97706" },
            { title: "Sports", items: sportsNews, color: "#7c3aed" },
          ].map((section) => (
            <Paper key={section.title} p="md" radius="md" withBorder bg="white" c="black">
              <Group justify="space-between" mb="sm">
                <Text fw={800} size="sm">
                  {section.title}
                </Text>
                <Anchor size="xs" c="dimmed" fw={500}>
                  View All →
                </Anchor>
              </Group>
              {section.items[0] ? (
                <Box
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedNews(section.items[0])}
                >
                  <Image
                    src={getImage(section.items[0])}
                    h={140}
                    radius={8}
                    fit="cover"
                    mb="sm"
                  />
                  <Text size="sm" fw={600} lineClamp={2} mb={6}>
                    {getTitle(section.items[0])}
                  </Text>
                  <Group gap={8}>
                    <Text size="xs" c="dimmed">
                      {getDate(section.items[0])}
                    </Text>
                    <Text size="xs" c="dimmed">
                      · 2 min read
                    </Text>
                  </Group>
                </Box>
              ) : (
                <Text size="sm" c="dimmed">
                  No articles yet
                </Text>
              )}
            </Paper>
          ))}
        </SimpleGrid>

        {/* ═══════ ALL NEWS GRID ═══════ */}
        <Box mt={40}>
          <Title
            order={3}
            ta="center"
            mb="xl"
            style={{
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#0f172a",
            }}
          >
            — All News —
          </Title>

          <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }} spacing="lg">
            {filteredNews.map((item, idx) => (
              <Card
                key={item.id || idx}
                padding={0}
                radius="md"
                withBorder
                style={{
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onClick={() => setSelectedNews(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Card.Section>
                  <Image src={getImage(item)} h={160} fit="cover" />
                </Card.Section>
                <Box p="md">
                  <Group gap={6} mb={8}>
                    <Badge size="xs" variant="light" color="red">
                      {getBadge(item)}
                    </Badge>
                    {item._source && (
                      <Badge size="xs" variant="outline" color="gray">
                        {item._source}
                      </Badge>
                    )}
                  </Group>
                  <Text fw={600} size="sm" lineClamp={2} style={{ lineHeight: 1.4 }}>
                    {getTitle(item)}
                  </Text>
                  <Text size="xs" c="dimmed" mt={6}>
                    {getDate(item)} · {getTimeAgo(item)}
                  </Text>
                </Box>
              </Card>
            ))}
          </SimpleGrid>

          {filteredNews.length === 0 && (
            <Center py={60}>
              <Text c="dimmed">Is category mein koi news nahi mili.</Text>
            </Center>
          )}
        </Box>
      </Container>    
    </Box>
  );
}