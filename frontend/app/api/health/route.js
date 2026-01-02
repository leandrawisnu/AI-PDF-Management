export async function GET() {
  return Response.json({ 
    status: 'healthy',
    service: 'Next.js Frontend',
    timestamp: new Date().toISOString()
  })
}