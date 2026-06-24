import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Users } from 'lucide-react'
import { Segment } from '~/lib/transcript'
import { Input } from '~/components/ui/input'
import { ModifyState } from '~/lib/types'

// Editor that lets the user assign a real name to each diarization speaker.
// Speaker ids come from the segments; names are persisted in preferences.
export default function SpeakerNames({
	segments,
	speakerNames,
	setSpeakerNames,
}: {
	segments: Segment[] | null
	speakerNames: Record<number, string>
	setSpeakerNames: ModifyState<Record<number, string>>
}) {
	const { t } = useTranslation()

	const speakerIds = useMemo(() => {
		const ids = new Set<number>()
		for (const segment of segments ?? []) {
			if (segment.speaker != null) ids.add(segment.speaker)
		}
		return Array.from(ids).sort((a, b) => a - b)
	}, [segments])

	if (speakerIds.length === 0) return null

	function updateName(id: number, value: string) {
		setSpeakerNames((prev) => {
			const next = { ...prev }
			if (value.trim()) {
				next[id] = value
			} else {
				delete next[id]
			}
			return next
		})
	}

	return (
		<div className="mx-auto w-full max-w-3xl space-y-3 rounded-lg border border-border/60 bg-card/45 p-3">
			<div className="flex items-center gap-2 text-sm font-medium">
				<Users className="h-4 w-4" />
				{t('common.speaker-names-title')}
			</div>
			<p className="text-xs text-muted-foreground">{t('common.speaker-names-hint')}</p>
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
				{speakerIds.map((id) => (
					<div key={id} className="flex items-center gap-2">
						<span className="w-24 shrink-0 text-sm text-muted-foreground">
							{t('common.speaker-prefix')} {id + 1}
						</span>
						<Input
							value={speakerNames[id] ?? ''}
							placeholder={`${t('common.speaker-prefix')} ${id + 1}`}
							onChange={(e) => updateName(id, e.target.value)}
						/>
					</div>
				))}
			</div>
		</div>
	)
}
