export const initialValue = `"use client"

import { useCounter } from "@/hooks/use-counter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CounterDemo() {
  const { count, increment, decrement, reset } = useCounter(0)

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Contador de Perritos Adoptados</CardTitle>
            <CardDescription>Usa nuestro hook personalizado useCounter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-6xl font-bold text-primary">{count}</p>
              <p className="mt-2 text-muted-foreground">perritos felices en nuevos hogares</p>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={increment} size="lg">
                Incrementar
              </Button>
              <Button onClick={decrement} variant="outline" size="lg">
                Decrementar
              </Button>
              <Button onClick={reset} variant="secondary" size="lg">
                Resetear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
    `