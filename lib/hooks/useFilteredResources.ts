'use client'

import { useMemo } from 'react'
import type { Ressource } from '@/lib/types'
import type { ClientFilters } from './useFilters'

/**
 * Filtre côté client pour les champs sans index BDD
 * (themes, competences, materials, intensity)
 */
export function useFilteredResources(
  resources: Ressource[],
  clientFilters: ClientFilters
): Ressource[] {
  return useMemo(() => {
    let filtered = [...resources]

    // Filtre par thèmes (overlaps - au moins un thème en commun)
    if (clientFilters.themes.length > 0) {
      filtered = filtered.filter(r => {
        if (!r.themes?.length) return false
        return clientFilters.themes.some(theme => r.themes!.includes(theme))
      })
    }

    // Filtre par compétences (overlaps - au moins une compétence en commun)
    if (clientFilters.competences.length > 0) {
      filtered = filtered.filter(r => {
        if (!r.competences?.length) return false
        return clientFilters.competences.some(comp => r.competences!.includes(comp))
      })
    }

    // Filtre par matériaux
    if (clientFilters.materials.length > 0) {
      if (clientFilters.materialMode === 'match') {
        // Mode "J'ai ce matériel" : la ressource doit être faisable
        // avec UNIQUEMENT les matériaux possédés
        filtered = filtered.filter(r => {
          // Extraire les matériaux de la ressource
          const resourceMaterials = extractMaterialsFromResource(r)
          if (resourceMaterials.length === 0) return true // Pas de matériel requis = OK

          // Tous les matériaux de la ressource doivent être dans la liste possédée
          return resourceMaterials.every(mat =>
            clientFilters.materials.includes(mat)
          )
        })
      } else {
        // Mode "Filtre" : la ressource doit contenir AU MOINS UN
        // matériau de la sélection
        filtered = filtered.filter(r => {
          const resourceMaterials = extractMaterialsFromResource(r)
          if (resourceMaterials.length === 0) return false
          return clientFilters.materials.some(mat =>
            resourceMaterials.includes(mat)
          )
        })
      }
    }

    // Filtre par intensité (si le champ existe)
    // Note: Ce champ n'existe peut-être pas encore dans la BDD
    if (clientFilters.intensity) {
      filtered = filtered.filter(r => {
        // Cast car le champ n'est pas dans le type actuel
        const intensity = (r as any).intensity
        return intensity === clientFilters.intensity
      })
    }

    return filtered
  }, [resources, clientFilters])
}

/**
 * Extrait la liste des matériaux d'une ressource
 * Combine les données de materiel_json et du champ materials si présent
 */
function extractMaterialsFromResource(resource: Ressource): string[] {
  const materials: string[] = []

  // Depuis materiel_json (format structuré)
  if (resource.materiel_json?.length) {
    for (const item of resource.materiel_json) {
      if (item.item) {
        materials.push(item.item)
      }
    }
  }

  // Depuis le champ materials si présent (format Resource marketplace)
  const resourceAny = resource as any
  if (resourceAny.materials?.length) {
    materials.push(...resourceAny.materials)
  }

  // Dédupliquer
  return [...new Set(materials)]
}

/**
 * Hook simplifié qui combine le fetch serveur et le filtrage client
 * Usage:
 * const { filteredResources, isFiltering } = useResourcesWithFilters(resources, clientFilters)
 */
export function useResourcesWithFilters(
  resources: Ressource[],
  clientFilters: ClientFilters
) {
  const filteredResources = useFilteredResources(resources, clientFilters)

  // Indique si un filtrage client est actif
  const isFiltering =
    clientFilters.themes.length > 0 ||
    clientFilters.competences.length > 0 ||
    clientFilters.materials.length > 0 ||
    clientFilters.intensity !== null

  return {
    filteredResources,
    isFiltering,
    totalBeforeClientFilter: resources.length,
    totalAfterClientFilter: filteredResources.length,
  }
}
