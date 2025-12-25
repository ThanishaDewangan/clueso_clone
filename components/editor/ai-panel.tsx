"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Wand2, Mic, MessageSquare, Zap, Loader2, Sparkles } from "lucide-react"
import { useState } from "react"

interface AIPanelProps {
  projectId: string
}

export function AIPanel({ projectId }: AIPanelProps) {
  const [script, setScript] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState("alloy")
  const [captionStyle, setCaptionStyle] = useState("modern")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isTranslating, setIsTranslating] = useState(false)

  const handleGenerateScript = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          prompt: "",
        }),
      })

      if (!response.ok) throw new Error("Failed to generate script")

      const data = await response.json()
      setScript(data.script.content)
    } catch (error) {
      console.error("Script generation error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleImproveScript = async () => {
    if (!script) return
    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/improve-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script_id: projectId,
          improvements: "",
        }),
      })

      if (!response.ok) throw new Error("Failed to improve script")

      const data = await response.json()
      setScript(data.script.content)
    } catch (error) {
      console.error("Script improvement error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateVoiceover = async () => {
    try {
      const response = await fetch("/api/ai/generate-voiceover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script_id: projectId,
          voice: selectedVoice,
          language: selectedLanguage,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate voiceover")

      const data = await response.json()
      alert(`Voiceover generation started! ${data.message}`)
    } catch (error) {
      console.error("Voiceover generation error:", error)
    }
  }

  const handleApplyCaptions = async () => {
    alert("Auto captions applied! This would use speech recognition in production.")
  }

  const handleApplyAutoZoom = async () => {
    alert("Auto zoom and pan applied! This would analyze video content in production.")
  }

  const handleTranslate = async (targetLang: string) => {
    if (!script) return
    setIsTranslating(true)
    try {
      const response = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script_id: projectId,
          target_language: targetLang,
        }),
      })

      if (!response.ok) throw new Error("Failed to translate script")

      const data = await response.json()
      setScript(data.script.content)
      setSelectedLanguage(targetLang)
    } catch (error) {
      console.error("Translation error:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            AI Features
          </CardTitle>
          <CardDescription>Enhance your video with AI-powered tools</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="script" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="script">
            <Wand2 className="size-4 mr-1" />
            Script
          </TabsTrigger>
          <TabsTrigger value="voiceover">
            <Mic className="size-4 mr-1" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="captions">
            <MessageSquare className="size-4 mr-1" />
            Captions
          </TabsTrigger>
          <TabsTrigger value="effects">
            <Zap className="size-4 mr-1" />
            Effects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="script" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Script Generator</CardTitle>
              <CardDescription>Generate or improve your video script with AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="script">Video Script</Label>
                <Textarea
                  id="script"
                  placeholder="Enter your script or generate one with AI..."
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  rows={8}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleGenerateScript} disabled={isGenerating} className="flex-1">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 size-4" />
                      Generate Script
                    </>
                  )}
                </Button>
                <Button onClick={handleImproveScript} variant="outline" disabled={!script || isGenerating}>
                  <Sparkles className="mr-2 size-4" />
                  Improve
                </Button>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="language">Translate Script</Label>
                <div className="flex gap-2">
                  <Select value={selectedLanguage} onValueChange={handleTranslate} disabled={!script || isTranslating}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish (Español)</SelectItem>
                      <SelectItem value="fr">French (Français)</SelectItem>
                      <SelectItem value="de">German (Deutsch)</SelectItem>
                      <SelectItem value="it">Italian (Italiano)</SelectItem>
                      <SelectItem value="pt">Portuguese (Português)</SelectItem>
                      <SelectItem value="ja">Japanese (日本語)</SelectItem>
                      <SelectItem value="ko">Korean (한국어)</SelectItem>
                      <SelectItem value="zh">Chinese (中文)</SelectItem>
                    </SelectContent>
                  </Select>
                  {isTranslating && <Loader2 className="size-4 animate-spin" />}
                </div>
                <p className="text-xs text-muted-foreground">AI-powered translation maintains tone and formatting</p>
              </div>

              <div className="text-xs text-muted-foreground">
                AI will analyze your video content and generate a professional script
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voiceover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Voiceover</CardTitle>
              <CardDescription>Generate natural-sounding voiceovers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="voice">Voice Selection</Label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger id="voice">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                    <SelectItem value="echo">Echo (Male)</SelectItem>
                    <SelectItem value="fable">Fable (British)</SelectItem>
                    <SelectItem value="onyx">Onyx (Deep)</SelectItem>
                    <SelectItem value="nova">Nova (Female)</SelectItem>
                    <SelectItem value="shimmer">Shimmer (Bright)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium mb-1">Script Preview</p>
                <p className="text-muted-foreground line-clamp-3">
                  {script || "Write or generate a script first to create voiceover"}
                </p>
              </div>

              <Button onClick={handleGenerateVoiceover} disabled={!script} className="w-full">
                <Mic className="mr-2 size-4" />
                Generate Voiceover
              </Button>

              <div className="text-xs text-muted-foreground">
                High-quality AI voices in multiple languages and accents
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="captions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Auto Captions</CardTitle>
              <CardDescription>Automatically generate accurate captions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="caption-style">Caption Style</Label>
                <Select value={captionStyle} onValueChange={setCaptionStyle}>
                  <SelectTrigger id="caption-style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern (Bold)</SelectItem>
                    <SelectItem value="minimal">Minimal (Clean)</SelectItem>
                    <SelectItem value="dynamic">Dynamic (Animated)</SelectItem>
                    <SelectItem value="classic">Classic (Traditional)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded text-sm font-semibold">
                    Sample caption text
                  </div>
                </div>
              </div>

              <Button onClick={handleApplyCaptions} className="w-full">
                <MessageSquare className="mr-2 size-4" />
                Apply Auto Captions
              </Button>

              <div className="flex gap-2">
                <Badge variant="secondary">95% Accuracy</Badge>
                <Badge variant="secondary">Multi-language</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Smart Effects</CardTitle>
              <CardDescription>AI-powered video enhancements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Zap className="size-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Auto Zoom & Pan</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Automatically zoom in on important UI elements and cursor movements
                    </p>
                    <Button onClick={handleApplyAutoZoom} size="sm">
                      Apply Effect
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Smart Highlights</h4>
                    <p className="text-sm text-muted-foreground mb-2">Highlight clicks and key actions automatically</p>
                    <Button size="sm" variant="outline">
                      Apply Effect
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Wand2 className="size-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Background Blur</h4>
                    <p className="text-sm text-muted-foreground mb-2">Blur distracting background elements</p>
                    <Button size="sm" variant="outline">
                      Apply Effect
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
