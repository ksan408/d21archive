/* D21 Archive Offline Service Worker (Cache-First) */
const CACHE_NAME = "d21-archive-v1";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./diagrams/bf_12_front_door_window_regulator_latch.png",
  "./diagrams/bf_36_instrument_cluster_dash_removal.png",
  "./diagrams/bf_51_truck_bed_removal_lift_points.png",
  "./diagrams/bf_53_cab_truck_bed_mounting_bolts.png",
  "./diagrams/br_12_brake_master_cylinder.png",
  "./diagrams/br_13_load_sensing_proportioning_valve.png",
  "./diagrams/br_15_2wd_cl28va_front_disc_brake.png",
  "./diagrams/br_20_2wd_lt26b_rear_drum_brake.png",
  "./diagrams/br_31_parking_brake_control_cables.png",
  "./diagrams/br_7_brake_pedal_stop_switch.png",
  "./diagrams/br_9_brake_vacuum_booster.png",
  "./diagrams/cl_11_clutch_release_bearing_fork.png",
  "./diagrams/cl_4_hydraulic_clutch_system.png",
  "./diagrams/cl_5_clutch_pedal_adjustment.png",
  "./diagrams/cl_8_clutch_master_cylinder.png",
  "./diagrams/cl_9_clutch_slave_operating_cylinder.png",
  "./diagrams/ef_ec_165_eccs_component_locations.png",
  "./diagrams/ef_ec_166_ka24e_engine_bay_sensors.png",
  "./diagrams/ef_ec_172_ecu_leds_cas_maf.png",
  "./diagrams/ef_ec_173_ect_tps_fuel_injector.png",
  "./diagrams/ef_ec_174_fpr_o2_fuel_pump_transistor.png",
  "./diagrams/ef_ec_175_iaa_aac_vss_egr_valve.png",
  "./diagrams/ef_ec_227_ecu_diagnostic_modes.png",
  "./diagrams/ef_ec_319_fs5w71c_neutral_backup_od_switches.png",
  "./diagrams/ef_ec_321_fuel_pressure_release_test.png",
  "./diagrams/ef_ec_322_fuel_injectors_removal.png",
  "./diagrams/el_100_ka24e_engine_mt_harness_switches.png",
  "./diagrams/el_107_super_multiple_junction_smj.png",
  "./diagrams/el_20_starter_motor_s114_607.png",
  "./diagrams/el_32_alternator_lr160_723.png",
  "./diagrams/el_54_combination_meter_cluster.png",
  "./diagrams/el_5_fusible_link_fuse_block_check.png",
  "./diagrams/el_6_fuse_block_layout.png",
  "./diagrams/el_89_engine_bay_relay_box.png",
  "./diagrams/el_93_engine_bay_harness_relays.png",
  "./diagrams/el_95_cab_main_harness_ignition_grounds.png",
  "./diagrams/em_58_ka24e_outer_components.png",
  "./diagrams/em_60_ka24e_oil_pan_bolt_sequence.png",
  "./diagrams/em_62_ka24e_timing_chain_exploded.png",
  "./diagrams/em_65_ka24e_timing_chain_marks.png",
  "./diagrams/em_70_ka24e_cylinder_head_exploded.png",
  "./diagrams/em_81_ka24e_cylinder_head_bolt_sequence.png",
  "./diagrams/fa_17_2wd_front_hub_wheel_bearings.png",
  "./diagrams/fa_39_2wd_front_suspension_exploded.png",
  "./diagrams/fa_4_2wd_front_suspension_overview.png",
  "./diagrams/fa_8_2wd_wheel_bearing_preload.png",
  "./diagrams/fa_9_2wd_wheel_bearing_45deg_backoff.png",
  "./diagrams/fe_4_in_tank_fuel_pump_tank.png",
  "./diagrams/fe_5_exhaust_manifold_o2_sensor.png",
  "./diagrams/ha_2_hvac_air_flow_heater_core.png",
  "./diagrams/ha_3_hvac_component_layout.png",
  "./diagrams/ha_49_blower_motor_resistor_cooling_unit.png",
  "./diagrams/ha_4_hvac_control_cables.png",
  "./diagrams/ha_5_hvac_temp_intake_cables.png",
  "./diagrams/ha_6_heater_wiring_fan_switch.png",
  "./diagrams/lc_15_ka24e_lubrication_circuit_oil_filter.png",
  "./diagrams/lc_17_ka24e_oil_pump_spindle.png",
  "./diagrams/lc_18_ka24e_oil_filter_bracket_pump_clearances.png",
  "./diagrams/lc_20_ka24e_water_pump.png",
  "./diagrams/lc_23_radiator_fan_cooling_bleed.png",
  "./diagrams/ma_15_drive_belts_coolant_drain.png",
  "./diagrams/ma_16_coolant_air_relief_plug.png",
  "./diagrams/ma_17_fuel_filter_air_cleaner.png",
  "./diagrams/ma_18_ka24e_oil_filter_drain_plug.png",
  "./diagrams/mt_10_fs5w71c_case_switches_pinion.png",
  "./diagrams/mt_11_fs5w71c_gear_components_speedometer_drive.png",
  "./diagrams/mt_12_fs5w71c_2wd_shift_control_components.png",
  "./diagrams/mt_9_fs5w71c_bellhousing_bolts_ka24e.png",
  "./diagrams/pd_10_companion_flange_match_marks.png",
  "./diagrams/pd_63_h190a_rear_differential_carrier.png",
  "./diagrams/pd_9_2wd_propeller_shaft_companion_flange.png",
  "./diagrams/ra_4_2wd_rear_leaf_springs_overview.png",
  "./diagrams/ra_7_h190a_rear_axle_shaft_plugs.png",
  "./diagrams/st_40_2wd_steering_linkage_idler_tie_rods.png"
];

async function precacheAll() {
  const cache = await caches.open(CACHE_NAME);
  const chunkSize = 8;
  for (let i = 0; i < PRECACHE_URLS.length; i += chunkSize) {
    const chunk = PRECACHE_URLS.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (url) => {
        const req = new Request(url, { cache: "reload" });
        const resp = await fetch(req);
        if (!resp || !resp.ok) {
          throw new Error("Failed to precache " + url + " (" + (resp ? resp.status : "no response") + ")");
        }
        await cache.put(url, resp);
      })
    );
  }
}

async function getCacheStatus() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  const hasIndex = Boolean(await cache.match("./index.html"));
  const hasManifest = Boolean(await cache.match("./manifest.json"));
  const diagramCount = PRECACHE_URLS.filter((u) => u.startsWith("./diagrams/")).length;
  let cachedDiagrams = 0;
  for (const req of keys) {
    if (req.url.includes("/diagrams/")) cachedDiagrams += 1;
  }
  const ready = hasIndex && hasManifest && cachedDiagrams >= diagramCount;
  return {
    type: "D21_OFFLINE_STATUS",
    ready,
    cacheName: CACHE_NAME,
    cachedCount: keys.length,
    totalCount: PRECACHE_URLS.length,
    cachedDiagrams,
    diagramCount
  };
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    precacheAll().then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
    );
    await self.clients.claim();
    const status = await getCacheStatus();
    const clients = await self.clients.matchAll({ includeUncontrolled: true, type: "window" });
    for (const client of clients) {
      client.postMessage({
        type: "D21_OFFLINE_READY",
        ready: status.ready,
        cacheName: CACHE_NAME,
        cachedCount: status.cachedCount,
        totalCount: status.totalCount
      });
    }
  })());
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (data.type === "D21_CHECK_CACHE") {
    event.waitUntil((async () => {
      const status = await getCacheStatus();
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage(status);
      }
      if (event.source && typeof event.source.postMessage === "function") {
        event.source.postMessage(status);
      }
    })());
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const reqUrl = new URL(event.request.url);
  if (reqUrl.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request, { ignoreSearch: true });
    if (cached) {
      return cached;
    }

    if (event.request.mode === "navigate") {
      const cachedIndex = (await cache.match("./index.html")) || (await cache.match("./"));
      if (cachedIndex) {
        return cachedIndex;
      }
    }

    try {
      const networkResp = await fetch(event.request);
      if (networkResp && networkResp.ok && networkResp.type === "basic") {
        cache.put(event.request, networkResp.clone()).catch(() => {});
      }
      return networkResp;
    } catch (err) {
      if (event.request.mode === "navigate") {
        const fallback = (await cache.match("./index.html")) || (await cache.match("./"));
        if (fallback) return fallback;
      }
      throw err;
    }
  })());
});
