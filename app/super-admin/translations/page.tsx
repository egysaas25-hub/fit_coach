import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Download, Upload, Languages } from "lucide-react"

export default function SuperAdminTranslationsPage() {
  const languages = [
    { code: "en", name: "English", progress: 100, strings: 1247 },
    { code: "es", name: "Spanish", progress: 95, strings: 1185 },
    { code: "fr", name: "French", progress: 88, strings: 1098 },
    { code: "de", name: "German", progress: 72, strings: 898 },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Translations</h1>
            <p className="text-muted-foreground">Manage platform translations and localizations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            <Button variant="outline"><Upload className="mr-2 h-4 w-4" />Import</Button>
            <Button><Plus className="mr-2 h-4 w-4" />Add Language</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{languages.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Translation Strings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Missing Translations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">149</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Available Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {languages.map((lang) => (
                <div key={lang.code} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{lang.code === 'en' ? '🇺🇸' : lang.code === 'es' ? '🇪🇸' : lang.code === 'fr' ? '🇫🇷' : '🇩🇪'}</div>
                      <div>
                        <h3 className="font-semibold">{lang.name}</h3>
                        <p className="text-sm text-muted-foreground">{lang.strings} strings translated</p>
                      </div>
                    </div>
                    <Badge variant={lang.progress === 100 ? "default" : "secondary"}>{lang.progress}%</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${lang.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}